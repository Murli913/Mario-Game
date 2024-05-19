package com.example.mario.service;

import com.example.mario.modal.User;
import com.example.mario.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    @Override
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserById(Long id) {
        // Simulating fetching user from a database or another data source
        if (id == 1L) {
            User user = new User();
            user.setId(1L);
            user.setUsername("testUser");
            user.setScore(1);
            return user;
        } else {
            return null; // Return null if user with given id is not found
        }
    }


}
