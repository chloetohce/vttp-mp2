package vttp.project.mp2.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HiveConfiguration {
    @Value("${mqtt.broker.host}")
    private String host; 

    @Value("${mqtt.broker.port}")
    private int port;

    @Value("${mqtt.client.identifier}")
    private String client;

    // @Bean
    // public Mqtt5BlockingClient blockingClient() {
    //     Mqtt5BlockingClient client = Mqtt
    // }
}
