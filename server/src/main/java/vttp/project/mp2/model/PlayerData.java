package vttp.project.mp2.model;

import java.sql.ResultSet;

import org.springframework.jdbc.core.RowMapper;

public class PlayerData {
    private String username;

    private int stage;

    public static RowMapper<PlayerData> rowMapper() {
        return (ResultSet rs, int row) -> {
            PlayerData data = new PlayerData();
            data.setUsername(rs.getString("username"));
            data.setStage(rs.getInt("stage"));
            return data;
        };
    }

    public String getUsername() {return username;}
    public void setUsername(String username) {this.username = username;}

    public int getStage() {return stage;}
    public void setStage(int stage) {this.stage = stage;}

    
}
