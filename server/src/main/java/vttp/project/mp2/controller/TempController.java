package vttp.project.mp2.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/temp")
public class TempController {
    
    @GetMapping("")
    public ResponseEntity<String> temp() {
        return ResponseEntity.ok("accessed!");
    }
    
}
