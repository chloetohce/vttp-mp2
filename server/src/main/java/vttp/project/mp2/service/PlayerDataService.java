package vttp.project.mp2.service;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.repository.GameStateRepository;
import vttp.project.mp2.repository.PlayerRepository;

@Service
public class PlayerDataService {
    @Autowired
    private PlayerRepository repository;

    @Autowired
    private GameStateRepository gameStateRepository;

    public PlayerData getPlayerData(String username) throws InterruptedException, ExecutionException {
        PlayerData sql = repository.getPlayerData(username);
        PlayerData firestore = gameStateRepository.getPlayerData(username);

        firestore.setUsername(sql.getUsername());
        firestore.setStage(sql.getStage());
        firestore.setDay(sql.getDay());
        firestore.setGold(sql.getGold());
        return firestore;
    }

    @Transactional
    public void updatePlayerData(PlayerData data) throws InterruptedException, ExecutionException {
        repository.update(data);
        gameStateRepository.updatePlayerData(data);
    }

    public void createNewPlayer(String username) throws InterruptedException, ExecutionException {
        repository.createNewPlayer(username);
        gameStateRepository.createNewPlayer(username);
    }
}
