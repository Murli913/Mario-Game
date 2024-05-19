package com.example.mario.service;

import com.example.mario.modal.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);

    void deleteUserById(Long id);
    User getUserById(Long id);


}
