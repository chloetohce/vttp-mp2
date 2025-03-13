package vttp.project.mp2.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import vttp.project.mp2.exception.EmailNotFoundException;
import vttp.project.mp2.model.User;
import vttp.project.mp2.repository.UserRepository;

@Service
public class UserService implements UserDetailsService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User %s not found."
                .formatted(username)));
    }
    
    public UserDetails loadUserByEmail(String email) throws EmailNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new EmailNotFoundException("User with email %s not found."
                .formatted(email)));
    }

    public JsonObject signup(User input) {
        input.setPassword(passwordEncoder.encode(input.getPassword()));

        // Check if username or email already exists
        Optional<User> optUsername = userRepository.findByUsername(input.getUsername());
        Optional<User> optEmail = userRepository.findByEmail(input.getEmail());

        JsonObjectBuilder errorMsg = Json.createObjectBuilder();
        if (optUsername.isPresent()) {
            errorMsg.add("username", "An account with that username already exists.");
        }
        if (optEmail.isPresent()) {
            errorMsg.add("email", "This email has already been registered with a different account.");
        }

        if (optUsername.isPresent() || optEmail.isPresent()) {
            return errorMsg.build();
        }
        
        userRepository.register(input); 

        return errorMsg.build();
    }

    public String createNewRefreshToken(User user) {
        String newRefreshToken = jwtService.generateRefreshToken(user);
        userRepository.updateRefreshToken(newRefreshToken, user.getUsername());
        return newRefreshToken;
    }


}
