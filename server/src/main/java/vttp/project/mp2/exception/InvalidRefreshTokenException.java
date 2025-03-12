package vttp.project.mp2.exception;

public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException(String msg) {
        super(msg);
    }

    public InvalidRefreshTokenException(String msg, Throwable cause) {
        super(msg, cause);
    }
    
}
