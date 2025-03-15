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
        return jdbcTemplate.queryForObject(PlayerQuery.PLAYERDATA, 
            PlayerData.rowMapper(), username);
    }
}
