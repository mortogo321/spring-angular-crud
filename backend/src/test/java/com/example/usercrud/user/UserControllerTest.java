package com.example.usercrud.user;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.usercrud.common.exception.UserNotFoundException;
import com.example.usercrud.user.dto.UserRequest;
import com.example.usercrud.user.dto.UserResponse;
import tools.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Slice test for {@link UserController}: HTTP contract only, the service layer is mocked. */
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired private MockMvc mockMvc;

    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private UserService userService;

    @Test
    void getAllUsers_returnsOkWithList() throws Exception {
        UserResponse response =
                new UserResponse(1L, "Ada", "Lovelace", "ada@example.com", Instant.now(), Instant.now());
        when(userService.getAllUsers()).thenReturn(List.of(response));

        mockMvc
                .perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("ada@example.com"));
    }

    @Test
    void createUser_validBody_returnsCreatedWithLocationHeader() throws Exception {
        UserRequest request = new UserRequest("Ada", "Lovelace", "ada@example.com");
        UserResponse created =
                new UserResponse(1L, "Ada", "Lovelace", "ada@example.com", Instant.now(), Instant.now());
        when(userService.createUser(any(UserRequest.class))).thenReturn(created);

        mockMvc
                .perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/users/1"))
                .andExpect(jsonPath("$.email").value("ada@example.com"));
    }

    @Test
    void createUser_invalidBody_returnsBadRequestProblemDetail() throws Exception {
        UserRequest invalid = new UserRequest("", "", "not-an-email");

        mockMvc
                .perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(header().string("Content-Type", "application/problem+json"))
                .andExpect(jsonPath("$.errors.firstName").exists());
    }

    @Test
    void getUserById_missing_returnsNotFound() throws Exception {
        when(userService.getUserById(eq(99L))).thenThrow(new UserNotFoundException(99L));

        mockMvc.perform(get("/api/users/{id}", 99L)).andExpect(status().isNotFound());
    }

    @Test
    void deleteUser_existing_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/users/{id}", 1L)).andExpect(status().isNoContent());
    }
}
