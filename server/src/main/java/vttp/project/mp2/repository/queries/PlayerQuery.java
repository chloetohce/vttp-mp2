package vttp.project.mp2.repository.queries;

public class PlayerQuery {
    public static final String FIND_USERNAME = """
            select * from playerData where username = ?
            """;

    public static final String UPDATE_ALL = """
            update playerData
            set stage = ?, day = ?, gold = ?
            where username = ?
            """;

    public static final String NEW_PLAYER = "insert into playerData (username) values(?)";

    public static final String GET_STAGE = """
                    select stage from playerData where username = ?
                    """;
}
