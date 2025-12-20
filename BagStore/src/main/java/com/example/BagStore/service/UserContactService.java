package com.example.BagStore.service;

import com.example.BagStore.entity.UserContact;
import com.example.BagStore.repository.UserContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserContactService {

    @Autowired
    private UserContactRepository userContactRepository;

    public List<UserContact> getContactsByUserId(Integer userId) {
        return userContactRepository.findByUser_UserId(userId);
    }

    @Transactional
    public UserContact saveContact(Integer userId, UserContact contact) {

        List<UserContact> contacts =
                userContactRepository.findByUser_UserId(userId);

        // Nếu user chọn default
        if (Boolean.TRUE.equals(contact.getIsDefault())) {

            for (UserContact c : contacts) {
                c.setIsDefault(false);
            }

            userContactRepository.saveAll(contacts);
        }
        // Nếu là địa chỉ đầu tiên
        else if (contacts.isEmpty()) {
            contact.setIsDefault(true);
        }

        return userContactRepository.save(contact);
    }




    public void deleteContact(Integer id) {
        userContactRepository.deleteById(id);
    }

    @Transactional
    public void setDefaultContact(Integer userId, Integer contactId) {

        List<UserContact> contacts =
                userContactRepository.findByUser_UserId(userId);

        for (UserContact c : contacts) {
            c.setIsDefault(c.getContactId().equals(contactId));
        }

        userContactRepository.saveAll(contacts);
    }

}


