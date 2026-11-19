package com.eventify.eventifypro.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EventTitleValidator.class)
public @interface ValidEventTitle {
    String message() default "Etkinlik başlığı uygunsuz kelimeler içeremez!";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}