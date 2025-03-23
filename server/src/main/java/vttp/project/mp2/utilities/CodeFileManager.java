package vttp.project.mp2.utilities;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;

@Service
public class CodeFileManager {
    @Autowired
    private Firestore db;

    public static final String COL_NAME = "game-code";

    public DocumentSnapshot getGameFile(String key) throws InterruptedException, ExecutionException {
        DocumentReference doc = db.collection(COL_NAME).document(key);
        ApiFuture<DocumentSnapshot> future = doc.get();
        DocumentSnapshot document = future.get();

        System.out.println(document.getData());

        return document;
    }

    public void addGameFiles(String key, String userFile, File folder) throws InterruptedException, ExecutionException, IOException {
        Map<String, Object> document = getGameFile(key).getData();

        String entrypoint = document.getOrDefault("entrypoint", "")
            .equals("") ? userFile : document.get("entrypoint").toString();

        // Add compile script
        String compile = generateCompileScript(entrypoint);
        addFile(compile, new File(folder.getPath() + "/compile"));

        // Add run script
        String run = generateRunScript(entrypoint);
        addFile(run, new File(folder.getPath() + "/run"));

        // TODO: Add in function to add in necessary game files (Currently not needed)
    }

    private String generateCompileScript(String entrypoint) {
        StringBuilder builder = new StringBuilder();
        builder.append("#!/bin/bash\n");
        builder.append("/usr/local/openjdk13/bin/javac ")
            .append(entrypoint)
            .append(".java");
        return builder.toString();
    }

    private String generateRunScript(String entrypoint) {
        StringBuilder builder = new StringBuilder();
        builder.append("#!/bin/bash\n");
        builder.append("/usr/local/openjdk13/bin/java ")
            .append(entrypoint)
            .append(".java");
        return builder.toString();
    }

    private void addFile(String content, File path) throws IOException {
        path.createNewFile();
        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(path));
        out.write(content.getBytes());

        out.close();
    }
    
}
