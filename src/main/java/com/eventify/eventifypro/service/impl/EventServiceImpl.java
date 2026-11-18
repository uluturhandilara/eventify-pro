package com.eventify.eventifypro.service.impl;

import com.eventify.eventifypro.dto.EventResponseDto;
import com.eventify.eventifypro.mapper.EventMapper;
import com.eventify.eventifypro.repository.EventRepository;
import com.eventify.eventifypro.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Override
    public Page<EventResponseDto> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable)
                .map(eventMapper::toResponseDto);
    }

    @Override
    public Page<EventResponseDto> getEventsByCategory(Long categoryId, Pageable pageable) {
        return eventRepository.findByCategoryId(categoryId, pageable)
                .map(eventMapper::toResponseDto);
    }

    @Override
    public Page<EventResponseDto> searchEventsByTitle(String title, Pageable pageable) {
        return eventRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(eventMapper::toResponseDto);
    }

    @Override
    public EventResponseDto getEventById(Long id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı ID: " + id));
        return eventMapper.toResponseDto(event);
    }
}