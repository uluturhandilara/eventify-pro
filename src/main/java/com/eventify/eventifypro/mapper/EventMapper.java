package com.eventify.eventifypro.mapper;

import com.eventify.eventifypro.dto.EventResponseDto;
import com.eventify.eventifypro.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    // Event içindeki category.name alanını EventResponseDto içindeki categoryName alanına eşliyoruz
    @Mapping(source = "category.name", target = "categoryName")
    EventResponseDto toResponseDto(Event event);
}