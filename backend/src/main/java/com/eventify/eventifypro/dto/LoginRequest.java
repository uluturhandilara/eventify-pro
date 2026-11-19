package com.eventify.eventifypro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "E-posta adresi boş olamaz!")
    @Email(message = "Lütfen geçerli bir e-posta adresi giriniz!")
    private String email;

    @NotBlank(message = "Şifre alanı boş olamaz!")
    private String password;
}