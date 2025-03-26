package vttp.project.mp2.configuration;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfiguration {

    @Bean
    public Firestore firestore() throws IOException {
        InputStream stream = getClass().getClassLoader()
            .getResourceAsStream("firebaseservice.json");

        if (stream == null) {
            System.err.println("firebaseservice not found in class path");
        }
        
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(stream);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();
            
            FirebaseApp app;
            if (FirebaseApp.getApps().isEmpty()) {
                app = FirebaseApp.initializeApp(options);
            } else {
                app = FirebaseApp.getInstance();
            }
            
            Firestore firestore = FirestoreClient.getFirestore(app);
            return firestore;
        } finally {
            stream.close();
        }
    }
}
