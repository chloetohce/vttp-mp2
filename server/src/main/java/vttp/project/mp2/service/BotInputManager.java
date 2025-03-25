package vttp.project.mp2.service;

import java.util.Arrays;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.project.mp2.model.Bot;

@Service
public class BotInputManager {
    @Autowired
    private CodeExecutionService service;
    
    public int[][] generateOutput(String type) {
        int[][] resources = new int[3][];
        for (int i = 0; i < 3; i++) {
            int arrSize = new Random().nextInt(5) + 1;
            resources[i] = new int[arrSize];
            for (int j = 0; j < arrSize; j++) {
                int chance = new Random().nextInt(100);
                if (chance < 20) {
                    resources[i][j] = 1;
                }
            }
        }
        return resources;
    }

    public String createWrapperCode(String botCode, int[][] generated) {
        StringBuilder builder = new StringBuilder();
        String code = botCode.trim();
        if (code.endsWith("}")) {
            code = code.substring(0, code.length() - 1);
        } else {
            code = code.substring(0, code.lastIndexOf("}"));
        }
        String className = service.extractClassName(code);

        builder.append(code)
            .append("\n")
            .append("   public static void main(String[] args) {")
            .append("       int[][] resources = {");

        for(int i = 0; i < generated.length; i++) {
            builder.append("{");
            for (int j = 0; j < generated[i].length; j++) {
                builder.append(generated[i][j]);
                if (j < generated[i].length - 1) {
                    builder.append(", ");
                }
            }
            builder.append("}");
            if (i < generated.length - 1) {
                builder.append(", ");
            }
        }
        builder.append("};\n");
        builder.append("        %s bot = new %s();\n".formatted(className, className))
            .append("       int mined = bot.mine(resources);\n")
            .append("       System.out.println(mined);\n")
            .append("   }\n")
            .append("}\n");
        return builder.toString();
    }

    public int run(Bot b, String username) {
        System.out.println("Running: " + b.getCode());
        try {
            if (b.getCode() == null || b.getCode().equals("")) {
                throw new Exception("Code is empty");
            }
        int[][] resources = generateOutput(b.getType());
        String code = createWrapperCode(b.getCode(), resources);
        JsonObject obj = Json.createObjectBuilder()
            .add("code", code)
            .add("context", Json.createObjectBuilder().add("stage", 0))
            .build();
        System.out.println("Resources " + resources);
        int total = 0;
            for (int i = 0; i < b.getCalls(); i++) {
                String output = service.executeCode(obj.toString(), username);
                System.out.println(output);
                int expected = Arrays.stream(resources)
                    .flatMapToInt(Arrays::stream)
                    .filter(e -> e == 1)
                    .sum();
                if (Integer.parseInt(output.trim()) > expected) {
                    throw new Exception("Invalid output");
                } else {
                    total += Integer.parseInt(output.trim());
                }
            }
            return total;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
