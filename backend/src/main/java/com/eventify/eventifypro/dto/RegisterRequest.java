package com.eventify.eventifypro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "E-posta adresi boş olamaz!")
    @Email(message = "Lütfen geçerli bir e-posta adresi giriniz!")
    private String email;

    @NotBlank(message = "Şifre alanı boş olamaz!")
    @Size(min = 6, message = "Şifre en az 6 karakterden oluşmalıdır!")
    private String password;

    @NotBlank(message = "Ad alanı boş olamaz!")
    private String firstName;

    @NotBlank(message = "Soyad alanı boş olamaz!")
    private String lastName;
}
