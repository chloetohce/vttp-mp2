package vttp.project.mp2.controller;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.service.PlayerDataService;


@RestController
@RequestMapping("/api/player")
public class PlayerController {
    @Autowired
    private PlayerDataService playerDataService;
    
    @GetMapping("data")
    public ResponseEntity<PlayerData> getPlayerData(@RequestParam(required=true) String username) throws InterruptedException, ExecutionException {
        return ResponseEntity.ok(playerDataService.getPlayerData(username));
    }
    
    @PutMapping(path = "/update")
    public ResponseEntity<String> updatePlayerData(
        @RequestParam(required = true) String username,
        @RequestBody PlayerData data
    ) throws InterruptedException, ExecutionException {
        // TODO: error handling if necessary
        System.out.println(data);
        playerDataService.updatePlayerData(data);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/next/{username}")
    public ResponseEntity<String> getNextDay(@PathVariable String username, @RequestBody PlayerData data) throws InterruptedException, ExecutionException {
        System.out.println("RECEIVED: " + data.toString());
        playerDataService.updatePlayerData(data);
        JsonArray result = playerDataService.runNextDay(username);
        System.out.println(result);
        return ResponseEntity.ok().body(result.toString());
    }
}
