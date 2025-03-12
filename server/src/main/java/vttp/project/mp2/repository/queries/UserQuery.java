package vttp.project.mp2.repository.queries;

public class UserQuery {
    public static final String FIND_EMAIL = "select * from users where email = ?";

    public static final String FIND_USERNAME = "select * from users where username = ?";

    public static final String INSERT = """
            insert into users (username, email, password)
            values(?, ?, ?)
            """;

    public static final String UPDATE_REFRESH_TOKEN = """
            update users
            set refreshToken = ?
            where username = ?
            """;

    public static final String FIND_REFRESH_TOKEN = """
            select *
            from users
            where refreshToken = ?
            """;
}
