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
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import vttp.project.mp2.model.User;
import vttp.project.mp2.repository.queries.UserQuery;

@Repository
public class UserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Optional<User> findByEmail(String email) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(UserQuery.FIND_EMAIL, email);
        if (rs.next()) {
            return Optional.of(User.toUser(rs));
        }
        return Optional.empty();
    }

    public Optional<User> findByUsername(String username) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(UserQuery.FIND_USERNAME, username);
        if (rs.next()) {
            return Optional.of(User.toUser(rs));
        }
        return Optional.empty();
    }

    public Optional<User> findByToken(String token) {
        return Optional.ofNullable(
            jdbcTemplate.queryForObject(UserQuery.FIND_REFRESH_TOKEN, User.rowMapper(), new Object[]{token})
        );
    }

    public String register(User user) {
        // TODO: Fix old code with int as id
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
        return user.getUsername();
    }

    public boolean updateRefreshToken(String refreshToken, String username) {
        return jdbcTemplate.update(UserQuery.UPDATE_REFRESH_TOKEN, refreshToken, username) > 0;
    }
}
