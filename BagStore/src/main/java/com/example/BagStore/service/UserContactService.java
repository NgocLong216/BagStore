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

    public UserContact saveContact(UserContact contact) {
        if (Boolean.TRUE.equals(contact.getIsDefault())) {
            userContactRepository.unsetDefaultByUserId(contact.getUser().getUserId());
        }
        return userContactRepository.save(contact);
    }


    public void deleteContact(Integer id) {
        userContactRepository.deleteById(id);
    }

    @Transactional
    public void setDefaultContact(Integer userId, Integer contactId) {
        userContactRepository.unsetDefaultByUserId(userId);
        userContactRepository.setDefaultByContactId(userId, contactId);
    }
}


