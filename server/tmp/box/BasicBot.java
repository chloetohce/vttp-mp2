interface Bot {
    public int mine(String[] resource);
}

public class BasicBot implements Bot {
    
    public int mine(String[] resources) {

        return 0;
    }

    public static void main(String[] args) {
        System.out.println(args[0]);
    }
}
