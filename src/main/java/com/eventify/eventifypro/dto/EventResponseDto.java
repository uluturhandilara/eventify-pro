package com.eventify.eventifypro.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class EventResponseDto implements Serializable {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private Double price;
    private Integer capacity;
    private String categoryName;
}