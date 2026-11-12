package com.eventify.eventifypro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class EventifyProApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventifyProApplication.class, args);
    }

}
