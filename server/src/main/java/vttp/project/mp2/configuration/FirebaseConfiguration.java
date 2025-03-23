package vttp.project.mp2.configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Logger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfiguration {

    @Bean
    public Firestore firestore() throws IOException {
        Resource resource = new ClassPathResource("firebaseservice.json");
        
        try (InputStream in = resource.getInputStream()) {
            GoogleCredentials credentials = GoogleCredentials.fromStream(in);
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
        }
    }
}
