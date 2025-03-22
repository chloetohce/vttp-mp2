package vttp.project.mp2.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

@Service
public class CodeExecutionService {

    @PostConstruct
    public void init() throws IOException {
        File temp = new File("./tmp/box");
        if (!temp.exists()) {
            temp.mkdirs();
        }

        if (!temp.canWrite()) {
            temp.setWritable(true);
        }

    }

    public void executeCode(String payload, String username) throws IOException {
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject entity = reader.readObject();
        String code = entity.getString("code");
        String className = extractClassName(code);

        saveCodeToFile(code, 0, username);
        
    }

    private void saveCodeToFile(String code, int stage, String username) throws IOException {
        File folder = new File("./tmp/box/%s_%s".formatted(username, stage));
        if (!folder.exists()) {
            folder.mkdirs();
        } else {
            deleteFolder(folder);
            folder.mkdirs();
        }
        System.out.println(folder.getPath());
        File userInput = new File(folder.getPath() + "/" + extractClassName(code));
        userInput.createNewFile();

        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(userInput));
        out.write(code.getBytes());

        out.close();
    }

    private String extractClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1) + ".java";
        }
        return "UserInput.java";
    }

    private void deleteFolder(File folder) {
        System.out.println("deleting");
        File[] files = folder.listFiles();
        if (files != null) {
            System.out.println(files);
            for (File f : files) {
                if (f.isDirectory())
                    deleteFolder(f);
                else
                    f.delete();
            }
        }
        folder.delete();
    }
}
