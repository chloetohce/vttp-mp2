package vttp.project.mp2.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.repository.PlayerRepository;

@Service
public class PlayerDataService {
    @Autowired
    private PlayerRepository repository;

    public PlayerData getPlayerData(String username) {
        return repository.getPlayerData(username);
    }
}
