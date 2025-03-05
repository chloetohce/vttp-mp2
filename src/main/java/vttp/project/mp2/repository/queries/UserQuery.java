package vttp.project.mp2.repository.queries;

public class UserQuery {
    public static final String FIND_EMAIL = "select * from users where email = ? limit 1;";

    public static final String FIND_USERNAME = "select * from users where username = ? limit 1;";

    public static final String INSERT = """
            insert into users (username, email, password)
            values(?, ?, ?)
            """;
}
