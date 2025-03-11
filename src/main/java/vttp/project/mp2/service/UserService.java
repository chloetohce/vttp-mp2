package vttp.project.mp2.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            .orElseThrow(() -> new UsernameNotFoundException("User %s not found.".formatted(username)));
    }
    
    public UserDetails loadUserByEmail(String email) throws EmailNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new EmailNotFoundException("User with email %s not found.".formatted(email)));
    }

    public User signup(User input) {
        input.setPassword(passwordEncoder.encode(input.getPassword()));
        userRepository.register(input);
        // input.setUid(uid);
        return input;
    }

    public String createNewRefreshToken(User user) {
        String newRefreshToken = jwtService.generateToken(user);
        userRepository.updateRefreshToken(newRefreshToken, user.getUsername());
        return newRefreshToken;
    }


}
