package vttp.project.mp2.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Bootstrap {
    @Value("${url.judge0}")
    private String judge0;

    @Bean("judge0")
    public String judge0() {
        return judge0;
    }
}
