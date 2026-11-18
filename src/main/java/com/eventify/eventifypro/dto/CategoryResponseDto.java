package com.eventify.eventifypro.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CategoryResponseDto implements Serializable {
    private Long id;
    private String name;
    private String description;
}