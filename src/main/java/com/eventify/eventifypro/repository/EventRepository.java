package com.eventify.eventifypro.repository;

import com.eventify.eventifypro.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE e.category.id = :categoryId")
    Page<Event> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    Page<Event> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}