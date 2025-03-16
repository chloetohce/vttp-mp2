package vttp.project.mp2.repository.queries;

public class PlayerQuery {
    public static final String FIND_USERNAME = """
            select * from playerData where username = ?
            """;

    public static final String INSERT_ALL = """
            insert into playerData (username, stage)
            values(?, ?)
            """;

    public static final String NEW_PLAYER = "insert into playerData (username) values(?)";
}
