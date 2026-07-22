package com.example.usercrud.common.exception;

/** Thrown when a create/update would leave two users sharing the same email address. */
public class EmailAlreadyInUseException extends RuntimeException {

    public EmailAlreadyInUseException(String email) {
        super("Email already in use: " + email);
    }
}
