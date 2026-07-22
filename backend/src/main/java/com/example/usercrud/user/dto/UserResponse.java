package com.example.usercrud.user.dto;

import java.time.Instant;

/** Outbound representation of a user returned by the API. */
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Instant createdAt,
        Instant updatedAt) {}
