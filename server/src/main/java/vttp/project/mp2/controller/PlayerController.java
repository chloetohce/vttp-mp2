package vttp.project.mp2.controller;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.service.PlayerDataService;


@RestController
@RequestMapping("/api/player")
public class PlayerController {
    @Autowired
    private PlayerDataService playerDataService;
    
    @GetMapping("data")
    public ResponseEntity<PlayerData> getPlayerData(@RequestParam(required=true) String username) throws InterruptedException, ExecutionException {
        System.out.println(playerDataService.getPlayerData(username));
        return ResponseEntity.ok(playerDataService.getPlayerData(username));
    }
    
    @PutMapping(path = "/update")
    public ResponseEntity<String> updatePlayerData(
        @RequestParam(required = true) String username,
        @RequestBody PlayerData data
    ) throws InterruptedException, ExecutionException {
        // TODO: error handling if necessary
        playerDataService.updatePlayerData(data);
        
        return ResponseEntity.ok().build();
    }
}
