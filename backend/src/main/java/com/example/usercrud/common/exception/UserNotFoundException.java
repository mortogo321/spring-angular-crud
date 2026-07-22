package com.example.usercrud.common.exception;

/** Thrown when a user lookup by id does not resolve to an existing record. */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}
