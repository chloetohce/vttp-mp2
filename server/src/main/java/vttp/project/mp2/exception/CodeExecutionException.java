package vttp.project.mp2.exception;

public class CodeExecutionException extends RuntimeException {
    public CodeExecutionException(String msg) {
        super(msg);
    }

    public CodeExecutionException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
