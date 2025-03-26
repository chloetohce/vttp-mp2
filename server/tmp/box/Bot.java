import java.util.Arrays;

public class Bot {
    public int mine(int[][] resources) {
        return Arrays.stream(resources)
            .flatMapToInt(Arrays::stream)
            .filter(e -> e == 1)
            .sum();
    }
}