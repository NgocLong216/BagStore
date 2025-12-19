package com.example.BagStore.repository;

import com.example.BagStore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(int userId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}

