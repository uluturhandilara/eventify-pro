package com.eventify.eventifypro.service;

import com.eventify.eventifypro.dto.EventResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {
    Page<EventResponseDto> getAllEvents(Pageable pageable);
    Page<EventResponseDto> getEventsByCategory(Long categoryId, Pageable pageable);
    Page<EventResponseDto> searchEventsByTitle(String title, Pageable pageable);
    EventResponseDto getEventById(Long id);
}