package com.eventify.eventifypro.repository;

import com.eventify.eventifypro.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId); // Kullanıcı bu etkinliğe daha önce bilet almış mı?
}