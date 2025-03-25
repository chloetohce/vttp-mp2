package vttp.project.mp2.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

import vttp.project.mp2.model.Bot;
import vttp.project.mp2.model.Item;
import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.utilities.Constant;

@Repository
public class GameStateRepository {
    @Autowired
    private Firestore db;

    @SuppressWarnings("unchecked")
    public PlayerData getPlayerData(String username) throws InterruptedException, ExecutionException {
        PlayerData data = new PlayerData();
        
        DocumentReference ref = db.collection(Constant.COL_GAME_STATE)
            .document(username);
        DocumentSnapshot document = ref.get().get();
        data.setEnergy(document.get("energy", Integer.class));
        data.setHp(document.get("hp", Integer.class));

        List<Map<String, Object>> itemsMap = (List<Map<String, Object>>) document.get("items");
        List<Item> items = itemsMap.stream()
            .map(m -> {
                Item i = new Item();
                i.setEffect((Map<String, String>) m.get("effect"));
                i.setName(m.get("name").toString());
                i.setDesc(m.get("desc").toString());
                return i;
            })
            .toList();
        
        data.setItems(items);
        

        CollectionReference bots = db.collection(Constant.COL_BOTS);
        Query botsQuery = bots.whereEqualTo("username", username);
        ApiFuture<QuerySnapshot> querySnapshot = botsQuery.get();
        List<Bot> botsList = new ArrayList<>();
        for (DocumentSnapshot d : querySnapshot.get().getDocuments()) {
            Bot b = new Bot();
            b.setCalls(d.get("calls", Integer.class));
            b.setId(d.get("id", Integer.class));
            b.setType(d.getString("type"));
            botsList.add(b);
        }
        data.setBots(botsList);
        return data;
    }

    public void updatePlayerData(PlayerData data) throws InterruptedException, ExecutionException {
        Map<String, Object> gameStateData = new HashMap<>();
        gameStateData.put("energy", data.getEnergy());
        gameStateData.put("hp", data.getHp());

        List<Map<String, Object>> mappedList = data.getItems()
            .stream()
            .map(i -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", i.getName());
                map.put("effect", i.getEffect());
                map.put("desc", i.getDesc());
                return map;
            })
            .toList();
        gameStateData.put("items", mappedList);

        ApiFuture<WriteResult> future = db.collection(Constant.COL_GAME_STATE)
            .document(data.getUsername())
            .set(gameStateData);
        System.out.println(future.get().getUpdateTime());
    }

    public void createNewPlayer(String username) throws InterruptedException, ExecutionException {
        Map<String, Object> gameStateData = new HashMap<>();
        gameStateData.put("energy", 10);
        gameStateData.put("hp", 10);
        gameStateData.put("items", List.of());

        ApiFuture<WriteResult> future = db.collection(Constant.COL_GAME_STATE)
            .document(username)
            .set(gameStateData);
        System.out.println(future.get().getUpdateTime());
    }

}
