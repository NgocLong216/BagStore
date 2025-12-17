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

    // Bỏ mặc định toàn bộ địa chỉ của user
    @Modifying
    @Transactional
    @Query("UPDATE UserContact c SET c.isDefault = false WHERE c.user.userId = :userId")
    void unsetDefaultByUserId(Integer userId);

    // Set mặc định cho 1 địa chỉ cụ thể
    @Modifying
    @Transactional
    @Query("""
        UPDATE UserContact c 
        SET c.isDefault = true 
        WHERE c.contactId = :contactId 
          AND c.user.userId = :userId
    """)
    void setDefaultByContactId(Integer userId, Integer contactId);
}



