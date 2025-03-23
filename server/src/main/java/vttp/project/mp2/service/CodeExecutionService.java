package vttp.project.mp2.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.util.Base64;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.project.mp2.exception.CodeExecutionException;
import vttp.project.mp2.exception.CodeWrongAnswerException;
import vttp.project.mp2.utilities.CodeFileManager;

@Service
public class CodeExecutionService {

    @Autowired
    private CodeFileManager codeManager;

    @Autowired
    @Qualifier("judge0")
    private String judge0Url;

    private static final RestTemplate restTemplate = new RestTemplate();
    private static final Logger logger = Logger.getLogger(CodeExecutionService.class.getName());
    private static final int MAX_CALLS = 10;

    @PostConstruct
    public void init() throws IOException {
        File temp = new File("./tmp");
        if (!temp.exists()) {
            temp.mkdirs();
            new File("./tmp/box").mkdirs();
            new File("./tmp/zipped").mkdirs();
        }

        if (!temp.canWrite()) {
            temp.setWritable(true);
        }

    }

    /*
     * Save the user input code to a temporary folder
     * Query the database to get the intended entrypoint for that stage, along with any associated code files
     * Write the all game code into the folder
     * Add the entrypoint file
     * Zip and send to judge0
     */
    public String executeCode(String payload, String username) throws IOException, InterruptedException, ExecutionException {
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject entity = reader.readObject();
        String code = entity.getString("code");
        JsonObject context = entity.getJsonObject("context");
        int stage = context.getInt("stage");
        
        File folder = saveCodeToFile(code, stage, username);

        codeManager.addGameFiles(Integer.toString(stage), extractClassName(code), folder);
        File zip = createZipFile("%s_%s".formatted(username, stage), folder);
        String encodedZip = encodeZipFile(zip);

        System.out.println(encodedZip);
        
        String token = sendRequest(encodedZip);
        deleteFolder(folder);
        String response = handleResponse(token);

        return Json.createReader(new StringReader(response)).readObject()
            .getString("stdout");
        
    }

    /**
     * Sends zip file to the api
     * @param encodedZip bse64 encoded zip file
     * @return request token (used to access result output)
     */
    private String sendRequest(String encodedZip) {
        String reqJson = Json.createObjectBuilder()
            .add("source_code", "")
            .add("language_id", 89)
            .add("additional_files", encodedZip)
            .add("time_limit", 5)
            .add("memory_limit", 128000)
            .build().toString();
        RequestEntity<String> request = RequestEntity.post(judge0Url + "submissions?wait=false")
            .contentType(MediaType.APPLICATION_JSON)
            .body(reqJson);
        ResponseEntity<String> response = restTemplate.exchange(request, String.class);
        
        logger.info("Response received - " + response.getBody());
        
        JsonReader reader = Json.createReader(new StringReader(response.getBody()));
        return reader.readObject().getString("token");
    }

    private String handleResponse(String token) throws InterruptedException {
        RequestEntity<Void> request = RequestEntity.get(judge0Url + "submissions/" + token)
            .accept(MediaType.APPLICATION_JSON)
            .build();
        
        int status = 0;
        ResponseEntity<String> response = ResponseEntity.ok("");

        for (int i = 0; i < MAX_CALLS; i++) {
            Thread.sleep(1000);
            response = restTemplate.exchange(request, String.class);
            status = Json.createReader(new StringReader(response.getBody()))
            .readObject()
            .getJsonObject("status")
            .getInt("id");
            System.out.println(response.getBody());
            if (status != 0 && status != 1 && status != 2) {
                break;
            }
        }

        if (status == 4) {
            throw new CodeWrongAnswerException("Code answer is wrong");
        } else if (status == 6) {
            JsonObject obj = Json.createReader(new StringReader(response.getBody())).readObject();
            throw new CodeExecutionException(obj.getString("compile_output"));
        } else if (status <= 12 && status >6 ) {
            JsonObject obj = Json.createReader(new StringReader(response.getBody())).readObject();
            throw new CodeExecutionException(obj.getString("stderr"));
        } else if (status == 3) {
            return response.getBody();
        } else {
            throw new CodeExecutionException("Something went wrong... Please try again.");
        }
    }

    /**
     * Adds the user input code into a folder generated from the user's username and 
     * the corresponding stage
     * @param code
     * @param stage
     * @param username
     * @return folder containing the user's code.
     * @throws IOException
     */
    private File saveCodeToFile(String code, int stage, String username) throws IOException {
        File folder = new File("./tmp/box/%s_%s".formatted(username, stage));
        if (!folder.exists()) {
            folder.mkdirs();
        } else {
            deleteFolder(folder);
            folder.mkdirs();
        }
        File userInput = new File(folder.getPath() + "/" + extractClassName(code) + ".java");
        userInput.createNewFile();

        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(userInput));
        out.write(code.getBytes());

        out.close();

        return folder;
    }

    private File createZipFile(String zipFileName, File toZip) throws IOException {
        File output = new File("./tmp/zipped/%s.zip".formatted(zipFileName));
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(output));
        for (File f : toZip.listFiles()) {
            FileInputStream in = new FileInputStream(f);
            ZipEntry zipEntry = new ZipEntry(f.getName());
            out.putNextEntry(zipEntry);
            
            byte[] bytes = new byte[1024];
            int length;
            while ((length = in.read(bytes)) >= 0) {
                out.write(bytes, 0, length);
            }

            out.closeEntry();
            in.close();;
        }
        out.close();
        return output;
    }

    private String encodeZipFile(File zipFile) throws IOException {
        String base64String = new String(Base64.getEncoder()
            .encodeToString(Files.readAllBytes(zipFile.toPath())));
        zipFile.delete();
        return base64String;
    }

    private String extractClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "UserInput";
    }

    private void deleteFolder(File folder) {
        System.out.println("deleting");
        File[] files = folder.listFiles();
        if (files != null) {
            for (File f : files) {
                System.out.println(f);
                if (f.isDirectory())
                    deleteFolder(f);
                else
                    f.delete();
            }
        }
        folder.delete();
    }
}
