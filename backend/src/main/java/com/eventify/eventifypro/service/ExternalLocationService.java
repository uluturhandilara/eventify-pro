package com.eventify.eventifypro.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ExternalLocationService {

    private final RestClient restClient;

    public ExternalLocationService() {
        // Örnek harici bir API taban adresi
        this.restClient = RestClient.builder()
                .baseUrl("https://jsonplaceholder.typicode.com")
                .build();
    }

    public String fetchExternalLocationInfo(Long locationId) {
        // Dış servisten veri çekme örneği
        return restClient.get()
                .uri("/todos/{id}", locationId)
                .retrieve()
                .body(String.class);
    }
}