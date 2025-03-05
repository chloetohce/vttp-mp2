package vttp.project.mp2.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import vttp.project.mp2.model.User;
import vttp.project.mp2.repository.UserRepository;

@Service
public class AuthenticationService {
    private final AuthenticationManager manager;
    private final UserRepository userRepository;

    public AuthenticationService(AuthenticationManager manager, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.manager = manager;
    }

    public void authenticate(String username, String password) {
        manager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
    }

    
    public User authenticate(User input) {
        authenticate(input.getUsername(), input.getPassword());

        return userRepository.findByUsername(input.getUsername())
            .orElseThrow();
    }
}
