package vttp.project.mp2.controller;

import java.io.StringReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.project.mp2.model.LoginResponse;
import vttp.project.mp2.model.User;
import vttp.project.mp2.service.AuthenticationService;
import vttp.project.mp2.service.JwtService;
import vttp.project.mp2.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User newUser) {
        JsonObject message = userService.signup(newUser);

        if (message.isEmpty()) {
            return ResponseEntity.ok("");
        }

        return ResponseEntity.badRequest().body(message.toString());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody User user) {
        User authenticatedUser = authenticationService.authenticate(user);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        String refreshToken = userService.createNewRefreshToken(authenticatedUser);
        LoginResponse response = new LoginResponse();
        response.setToken(jwtToken);
        response.setExpiresIn(jwtService.getExpirationTime());
        response.setRefreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody String request) {
        JsonReader reader = Json.createReader(new StringReader(request));
        String refreshToken = reader.readObject().getString("refreshToken");

        User authenticateRefreshToken = authenticationService.authenticateRefreshToken(refreshToken);
        String newJwtToken = userService.createNewRefreshToken(authenticateRefreshToken);
        LoginResponse response = new LoginResponse();
        response.setToken(newJwtToken);
        response.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(response);
    }
    
    
}
