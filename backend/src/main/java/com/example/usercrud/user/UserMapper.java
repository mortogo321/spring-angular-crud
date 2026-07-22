package com.example.usercrud.user;

import com.example.usercrud.user.dto.UserRequest;
import com.example.usercrud.user.dto.UserResponse;
import org.springframework.stereotype.Component;

/** Hand-written mapping between the {@link User} entity and its request/response DTOs. */
@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        return new User(request.firstName(), request.lastName(), request.email());
    }

    public void updateEntity(User user, UserRequest request) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
