package vttp.project.mp2.repository.queries;

public class BotQuery {

    public static final String GET_BOTS = """
            select * from bots where username = ?
            """;
    
    public static final String INSERT_BOT = """
            insert into bots (name, type, calls, username)
            values (?, ?, ?, ?)
            """;

    public static final String RESET = """
            delete from bots where username = ?
            """;
}
