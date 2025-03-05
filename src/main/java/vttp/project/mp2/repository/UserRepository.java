package vttp.project.mp2.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import vttp.project.mp2.model.User;
import vttp.project.mp2.repository.queries.UserQuery;

@Repository
public class UserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(
            jdbcTemplate.queryForObject(UserQuery.FIND_EMAIL, User.rowMapper(), new Object[]{email})
        );
    }

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(
            jdbcTemplate.queryForObject(UserQuery.FIND_USERNAME, User.rowMapper(), new Object[]{username})
        );
    }

    public int register(User user) {
        KeyHolder key = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {

            @Override
            public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
                PreparedStatement ps = con.prepareStatement(UserQuery.INSERT, new String[]{"uid"});

                ps.setString(1, user.getUsername());
                ps.setString(2, user.getEmail());
                ps.setString(3, user.getPassword());
                return ps;
            }
            
        }, key);

        // Return a user here or the generated key?
        return key.getKey().intValue();
    }
}
