package vttp.project.mp2.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import vttp.project.mp2.exception.InvalidRefreshTokenException;
import vttp.project.mp2.model.User;
import vttp.project.mp2.repository.UserRepository;

@Service
public class AuthenticationService {
    private final AuthenticationManager manager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthenticationService(AuthenticationManager manager, 
        UserRepository userRepository,
        JwtService jwtService) {
        this.userRepository = userRepository;
        this.manager = manager;
        this.jwtService = jwtService;
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

    /**
     * Checks if refresh token provided is in database and has not yet expired. 
     * @param refreshToken
     * @return user details
     * @throws InvalidRefreshTokenException if token stored is invalid, expired, or not found
     */
    public User authenticateRefreshToken(String refreshToken) {
        return userRepository.findByToken(refreshToken)
            .filter(u -> jwtService.isTokenValid(refreshToken, u))
            .orElseThrow(() -> new InvalidRefreshTokenException("invalid refresh token"));
    }
}
