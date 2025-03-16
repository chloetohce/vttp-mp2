package vttp.project.mp2.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import vttp.project.mp2.model.PlayerData;
import vttp.project.mp2.repository.queries.PlayerQuery;

@Repository
public class PlayerRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public PlayerData getPlayerData(String username) {
        return jdbcTemplate.queryForObject(PlayerQuery.FIND_USERNAME, 
            PlayerData.rowMapper(), username);
    }

    public int update(PlayerData data) {
        return jdbcTemplate.update(PlayerQuery.INSERT_ALL, data.getUsername(), 
            data.getStage());
    }

    public int createNewPlayer(String username) {
        return jdbcTemplate.update(PlayerQuery.NEW_PLAYER, username);
    }
}
