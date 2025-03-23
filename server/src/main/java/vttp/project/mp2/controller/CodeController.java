package vttp.project.mp2.controller;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;
import vttp.project.mp2.exception.CodeExecutionException;
import vttp.project.mp2.exception.CodeWrongAnswerException;
import vttp.project.mp2.service.CodeExecutionService;
import vttp.project.mp2.utilities.SecurityUtils;

@RestController
@RequestMapping("/api/code")
public class CodeController {
    @Autowired
    private CodeExecutionService service;
    
    @PostMapping("/execute")
    public ResponseEntity<String>  executeCode(@RequestBody String payload) {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        try {
            String result = service.executeCode(payload, SecurityUtils.getCurrentUsername());
            return ResponseEntity.ok().body(builder
                .add("message", result)
                .build().toString()
            );
        } catch (IOException | InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                builder.add("message", "Something went wrong")
                .build().toString()
            );
        } catch (CodeExecutionException e) {
            return ResponseEntity.badRequest().body(
                builder.add("message", e.getMessage())
                .build().toString()
            );
        } catch (CodeWrongAnswerException e) {
            return ResponseEntity.badRequest().body(
                builder.add("message", e.getMessage())
                .build().toString()
            );
        }

    }
}
