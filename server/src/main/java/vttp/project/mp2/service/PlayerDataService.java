package vttp.project.mp2.service;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import vttp.project.mp2.model.Bot;
import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.repository.BotRepository;
import vttp.project.mp2.repository.GameStateRepository;
import vttp.project.mp2.repository.PlayerRepository;

@Service
public class PlayerDataService {
    @Autowired
    private PlayerRepository repository;

    @Autowired
    private GameStateRepository gameStateRepository;

    @Autowired
    private BotRepository botRepository;

    @Autowired
    private BotInputManager botManager;

    public PlayerData getPlayerData(String username) throws InterruptedException, ExecutionException {
        PlayerData sql = repository.getPlayerData(username);
        List<Bot> bots = botRepository.getBots(username);
        PlayerData firestore = gameStateRepository.getPlayerData(username);

        firestore.setUsername(sql.getUsername());
        firestore.setStage(sql.getStage());
        firestore.setDay(sql.getDay());
        firestore.setGold(sql.getGold());
        firestore.setBots(bots);
        return firestore;
    }

    @Transactional
    public void updatePlayerData(PlayerData data) throws InterruptedException, ExecutionException {
        repository.update(data);
        gameStateRepository.updatePlayerData(data);
        botRepository.updateBots(data.getBots(), data.getUsername());
    }

    @Transactional
    public void createNewPlayer(String username) throws InterruptedException, ExecutionException {
        repository.createNewPlayer(username);
        gameStateRepository.createNewPlayer(username);
    }

    public int getStage(String username) {
        return repository.getStage(username);
    }

    public JsonArray runNextDay(String username) throws InterruptedException, ExecutionException {
        PlayerData old = getPlayerData(username);
        System.out.println("RUNNING NEXT DAY: " + old.toString());
        JsonArrayBuilder result = Json.createArrayBuilder();
        int toAdd = 0;
        for (Bot b : old.getBots()) {
            int output = botManager.run(b, username);
            toAdd += output;
            result.add(Json.createObjectBuilder()
                .add("name", b.getName())
                .add("output", output)
                .build()
            );
        }
        System.out.println(toAdd);
        old.setGold(old.getGold() + toAdd);

        old.setEnergy((int)(10 * (0.2 + 0.8 * (old.getHp() / 10))));
        old.setHp(old.getHp() - 1);
        old.setDay(old.getDay() + 1);

        updatePlayerData(old);
        return result.build();
    }

    @Transactional
    public void reset(String username) throws InterruptedException, ExecutionException {
        repository.reset(username);
        botRepository.reset(username);
        gameStateRepository.resetFields(username);
    }
}
