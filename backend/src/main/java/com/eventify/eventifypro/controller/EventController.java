package com.eventify.eventifypro.controller;

import com.eventify.eventifypro.dto.EventResponseDto;
import com.eventify.eventifypro.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Tüm etkinlikleri sayfalı listeleme (Örn: /events?page=0&size=10&sort=eventDate,asc)
    @GetMapping
    public ResponseEntity<Page<EventResponseDto>> getAllEvents(
            @PageableDefault(page = 0, size = 10, sort = "eventDate") Pageable pageable
    ) {
        return ResponseEntity.ok(eventService.getAllEvents(pageable));
    }

    // Kategoriye göre etkinlikleri listeleme
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<EventResponseDto>> getEventsByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(eventService.getEventsByCategory(categoryId, pageable));
    }

    // İsme göre arama yapma
    @GetMapping("/search")
    public ResponseEntity<Page<EventResponseDto>> searchEvents(
            @RequestParam String title,
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(eventService.searchEventsByTitle(title, pageable));
    }

    // ID ile etkinlik detayı getirme
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
