package vttp.project.mp2.exception;

public class CodeWrongAnswerException extends RuntimeException {
    public CodeWrongAnswerException(String msg) {
        super(msg);
    }

    public CodeWrongAnswerException(String msg, Throwable cause) {
        super(msg, cause);
    }
    
}
