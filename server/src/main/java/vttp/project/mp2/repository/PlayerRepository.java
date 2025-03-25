package vttp.project.mp2.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
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
        return jdbcTemplate.update(PlayerQuery.UPDATE_ALL,
            data.getStage(), data.getDay(), data.getGold(), data.getUsername()    
        );
    }

    public int createNewPlayer(String username) {
        return jdbcTemplate.update(PlayerQuery.NEW_PLAYER, username);
    }

    public int getStage(String username) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(PlayerQuery.GET_STAGE, username);
        rs.next();
        return rs.getInt("stage");
    }
}
