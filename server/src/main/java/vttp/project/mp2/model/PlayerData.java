package vttp.project.mp2.model;

import java.sql.ResultSet;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;

public class PlayerData {
    // Stored in MySQL
    private String username;

    private int stage;

    private int day;

    private int gold;

    // Stored in firestore
    private int hp;

    private int energy;

    private List<Item> items;

    // both
    private List<Bot> bots;

    public static RowMapper<PlayerData> rowMapper() {
        return (ResultSet rs, int row) -> {
            PlayerData data = new PlayerData();
            data.setUsername(rs.getString("username"));
            data.setStage(rs.getInt("stage"));
            data.setDay(rs.getInt("day"));
            data.setGold(rs.getInt("gold"));
            return data;
        };
    }

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public int getStage() {return stage;}
    public void setStage(int stage) {this.stage = stage;}

    public int getDay() {return day;}
    public void setDay(int day) {this.day = day;}

    public int getGold() {return gold;}
    public void setGold(int gold) {this.gold = gold;}

    public int getHp() {return hp;}
    public void setHp(int hp) {this.hp = hp;}

    public int getEnergy() {return energy;}
    public void setEnergy(int energy) {this.energy = energy;}

    public List<Item> getItems() {return items;}
    public void setItems(List<Item> items) {this.items = items;}

    public List<Bot> getBots() {return bots;}
    public void setBots(List<Bot> bots) {this.bots = bots;}

    @Override
    public String toString() {
        return "PlayerData [username=" + username + ", stage=" + stage + ", day=" + day + ", gold=" + gold + ", hp="
                + hp + ", energy=" + energy + ", items=" + items + ", bots=" + bots + "]";
    }

    
    
}
