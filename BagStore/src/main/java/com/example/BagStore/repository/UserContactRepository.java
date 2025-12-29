package com.example.BagStore.repository;

import com.example.BagStore.entity.User;
import com.example.BagStore.entity.UserContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserContactRepository extends JpaRepository<UserContact, Integer> {

    List<UserContact> findByUser(User user);

    List<UserContact> findByUser_UserId(Integer userId);

    boolean existsByUser_UserId(Integer userId);
    void deleteByUser_UserId(Integer userId);

}



