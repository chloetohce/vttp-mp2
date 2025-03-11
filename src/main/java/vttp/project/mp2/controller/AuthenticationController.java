package vttp.project.mp2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vttp.project.mp2.model.LoginResponse;
import vttp.project.mp2.model.User;
import vttp.project.mp2.service.AuthenticationService;
import vttp.project.mp2.service.JwtService;
import vttp.project.mp2.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
    public ResponseEntity<User> signup(@RequestBody User newUser) {
        User registeredUser = userService.signup(newUser);

        // TODO: Why am I returning the user data here??
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody User user) {
        User authenticatedUser = authenticationService.authenticate(user);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        String refreshToken = userService.createNewRefreshToken(authenticatedUser);
        System.out.println(jwtToken);
        System.out.println(refreshToken);
        LoginResponse response = new LoginResponse();
        response.setToken(jwtToken);
        response.setExpiresIn(jwtService.getExpirationTime());
        response.setRefreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody String refreshToken) {
        User authenticateRefreshToken = authenticationService.authenticateRefreshToken(refreshToken);
        String newJwtToken = userService.createNewRefreshToken(authenticateRefreshToken);
        LoginResponse response = new LoginResponse();
        response.setToken(newJwtToken);
        response.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(response);
    }
    
    
}
