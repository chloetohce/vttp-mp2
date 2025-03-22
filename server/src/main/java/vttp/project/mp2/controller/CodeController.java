package vttp.project.mp2.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vttp.project.mp2.service.CodeExecutionService;
import vttp.project.mp2.utilities.SecurityUtils;

@RestController
@RequestMapping("/api/code")
public class CodeController {
    @Autowired
    private CodeExecutionService service;
    
    @PostMapping("/execute")
    public ResponseEntity<String>  executeCode(@RequestBody String payload) {
        try {
            service.executeCode(payload, SecurityUtils.getCurrentUsername());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Something went wrong.");
        }

        return ResponseEntity.ok().body("");
    }
}
