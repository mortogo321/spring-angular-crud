package com.example.usercrud.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Inbound payload for creating or updating a user. */
public record UserRequest(
        @NotBlank(message = "First name is required")
                @Size(max = 100, message = "First name must be at most 100 characters")
                String firstName,
        @NotBlank(message = "Last name is required")
                @Size(max = 100, message = "Last name must be at most 100 characters")
                String lastName,
        @NotBlank(message = "Email is required")
                @Email(message = "Email must be a valid email address")
                @Size(max = 255, message = "Email must be at most 255 characters")
                String email) {}
