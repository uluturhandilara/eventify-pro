package com.eventify.eventifypro.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EventTitleValidator implements ConstraintValidator<ValidEventTitle, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        // Örnek kural: İçinde "test" kelimesi geçemez
        return !value.toLowerCase().contains("test");
    }
}