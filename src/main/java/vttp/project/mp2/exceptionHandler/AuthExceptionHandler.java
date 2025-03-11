package vttp.project.mp2.exceptionHandler;

import java.util.logging.Logger;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import vttp.project.mp2.exception.InvalidRefreshTokenException;
import vttp.project.mp2.model.ErrorMessage;

@RestControllerAdvice
public class AuthExceptionHandler {
    private static Logger LOGGER = Logger.getLogger(AuthExceptionHandler.class.getName());

    @ExceptionHandler({
        AuthenticationException.class, 
        MalformedJwtException.class, 
        JwtException.class, 
        SignatureException.class, 
        ExpiredJwtException.class,
        InvalidRefreshTokenException.class
    })
    public ResponseEntity<String> handleSecurityException(Exception e) {

        if (e instanceof BadCredentialsException || e instanceof UsernameNotFoundException) {
            LOGGER.info("BadCredentialsException: incorrect username or password");
            return ResponseEntity.status(HttpStatusCode.valueOf(401))
            .body(ErrorMessage.toResponse("The username or password is incorrect. "));
        }
        
        if (e instanceof ExpiredJwtException ex) {
            LOGGER.info("ExpiredJwtException: JWT token expired.");
            return ResponseEntity.status(HttpStatusCode.valueOf(403))
                .body(ErrorMessage.toResponse("The JWT token is expired at %s.".formatted(ex.getClaims().getExpiration())));
        }
        
        if (e instanceof SignatureException || e instanceof JwtException || e instanceof MalformedJwtException) {
            LOGGER.info("SignatureException: JWT Signature is invalid.");
            return ResponseEntity.status(HttpStatusCode.valueOf(400))
            .body(ErrorMessage.toResponse("The JWT signature is invalid."));
            
        } 

        if (e instanceof InvalidRefreshTokenException) {
            LOGGER.info("Refresh token received is invalid.");
            return ResponseEntity.status(511)
                .body(ErrorMessage.toResponse("Refresh token is invalid. Please log in again. "));
        } else {
            return ResponseEntity.internalServerError()
                .body(ErrorMessage.toResponse("An unknown error has occurred."));
        }
    }
}
