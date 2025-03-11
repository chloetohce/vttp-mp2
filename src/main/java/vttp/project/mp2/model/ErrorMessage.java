package vttp.project.mp2.model;

import jakarta.json.Json;

public class ErrorMessage {

    public static String toResponse(String msg) {
        return Json.createObjectBuilder()
            .add("message", msg)
            .add("timestamp", System.currentTimeMillis())
            .build()
            .toString();
    }
    
}
