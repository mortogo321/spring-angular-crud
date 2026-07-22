package com.example.usercrud.config;

import com.example.usercrud.user.User;
import com.example.usercrud.user.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds a handful of obviously-fake demo users on startup so the API and Swagger UI have
 * something to show out of the box. Only runs against an empty table, so it never duplicates data
 * on repeated restarts against a persistent database.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        userRepository.saveAll(
                List.of(
                        new User("Ada", "Lovelace", "ada@example.com"),
                        new User("Grace", "Hopper", "grace@example.com"),
                        new User("Alan", "Turing", "alan@example.com"),
                        new User("Katherine", "Johnson", "katherine@example.com")));
    }
}
