package com.example.mario.controller;

import com.example.mario.modal.User;
import com.example.mario.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void saveUser() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setScore(1);

        when(userService.saveUser(any(User.class))).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/saveUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"username\":\"testUser\",\"score\":1}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("testUser"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.score").value(1));
    }

    @Test
    void saveUser_withInvalidData() throws Exception {
        // Simulate invalid user data
        mockMvc.perform(MockMvcRequestBuilders.post("/saveUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"invalid\",\"username\":123,\"score\":\"invalid\"}"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString("Invalid input")));
    }







    @Test
    void saveUser_withLargeId() throws Exception {
        // Simulate user data with a large ID
        User user = new User();
        user.setId(9223372036854775807L); // Long.MAX_VALUE
        user.setUsername("testUser");
        user.setScore(1);

        when(userService.saveUser(any(User.class))).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/saveUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":9223372036854775807,\"username\":\"testUser\",\"score\":1}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(9223372036854775807L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("testUser"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.score").value(1));
    }


    @Test
    void saveUser_withSpecialCharactersInUsername() throws Exception {
        // Simulate user data with special characters in the username
        User user = new User();
        user.setId(1L);
        user.setUsername("test!User@#");
        user.setScore(1);

        when(userService.saveUser(any(User.class))).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/saveUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"username\":\"test!User@#\",\"score\":1}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("test!User@#"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.score").value(1));
    }

    @Test
    void saveUser_serviceThrowsException() throws Exception {
        // Simulate service throwing an exception
        when(userService.saveUser(any(User.class))).thenThrow(new RuntimeException("Service error"));

        mockMvc.perform(MockMvcRequestBuilders.post("/saveUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"username\":\"testUser\",\"score\":1}"))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.content().string("Internal server error: Service error"));
    }
    @Test
    void deleteUserById() throws Exception {
        // Mock the service method to indicate successful deletion
        doNothing().when(userService).deleteUserById(1L);

        // Perform DELETE request to delete the user by ID
        mockMvc.perform(MockMvcRequestBuilders.delete("/deleteUser/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getUserById() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setScore(1);

        when(userService.getUserById(1L)).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get("/getUser/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("testUser"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.score").value(1));
    }

}
