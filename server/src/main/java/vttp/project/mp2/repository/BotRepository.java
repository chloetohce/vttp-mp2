package vttp.project.mp2.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.mongodb.client.result.UpdateResult;

import vttp.project.mp2.model.Bot;
import vttp.project.mp2.repository.queries.BotQuery;

@Repository
public class BotRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Bot> getBots(String username) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(BotQuery.GET_BOTS, username);
        List<Bot> bots = new ArrayList<>();
        while (rs.next()) {
            Bot b = new Bot();
            b.setCalls(rs.getInt("calls"));
            b.setId(rs.getInt("id"));
            b.setName(rs.getString("name"));
            b.setType(rs.getString("type"));
            b.setUsername(username);
            bots.add(b);
        }
        
        for (Bot b: bots) {
            Query q = new Query(new Criteria("_id").is(b.getId()));
            Document doc = mongoTemplate.findOne(q, Document.class, "bots");
            b.setCode(doc.getString("code"));
            System.out.println("Getting bot: " + b.toString());
        }
        return bots;
    }

    public void updateBots(List<Bot> bots, String username) throws InterruptedException, ExecutionException {
        System.out.println("UPDATING BOTS " + bots.toString());
        List<Bot> toAdd = bots.stream()
            .filter(b -> b.getId() == 0)
            .toList();
        if (!toAdd.isEmpty()) {
            for (Bot bot : toAdd) {
                System.out.println("BOT ID" + bot.getId());
                KeyHolder keyHolder = new GeneratedKeyHolder();
                
                jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(
                        BotQuery.INSERT_BOT, 
                        Statement.RETURN_GENERATED_KEYS
                    );
                    ps.setString(1, bot.getName());
                    ps.setString(2, bot.getType());
                    ps.setInt(3, bot.getCalls());
                    ps.setString(4, username);
                    return ps;
                }, keyHolder);
                
                // Extract and set the generated key
                int key = keyHolder.getKey().intValue();
                bot.setId(key);
            }
        }
        
        System.out.println("UPDATING MONGO");
        for (Bot bot : bots) {
            System.out.println("BOT TO BE ADDED TO MONGO" + bot.toString());
            Query q = new Query(new Criteria("_id").is(bot.getId()))
                .limit(1);
            Update ops = new Update()
                .set("name", bot.getName())
                .set("type", bot.getType())
                .set("calls", bot.getCalls())
                .set("code", bot.getCode())
                .set("username", username);
            UpdateResult result = mongoTemplate.upsert(q, ops, "bots");
            System.out.println(result.getModifiedCount());
        }

    }

    public List<Bot> getBotDetails(String username) throws InterruptedException, ExecutionException {
        Query q = new Query(new Criteria("username").is(username));
        List<Document> docs = mongoTemplate.find(q, Document.class, "bots");

        return docs.stream()
            .map(d -> {
                Bot b = new Bot();
                b.setId(d.getInteger("id"));
                b.setCalls(d.getInteger("calls"));
                b.setName(d.getString("name"));
                b.setType(d.getString("type"));
                b.setCode(d.getString("code"));
                b.setUsername(d.getString("username"));
                return b;
            })
            .toList();
    }

    public void reset(String username) {
        jdbcTemplate.update(BotQuery.RESET, username);

        Query q = Query.query(new Criteria("username").is(username));
        mongoTemplate.remove(q, "bots");
    }
}
