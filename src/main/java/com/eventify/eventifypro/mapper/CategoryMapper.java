package com.eventify.eventifypro.mapper;

import com.eventify.eventifypro.dto.CategoryResponseDto;
import com.eventify.eventifypro.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    CategoryResponseDto toResponseDto(Category category);
}