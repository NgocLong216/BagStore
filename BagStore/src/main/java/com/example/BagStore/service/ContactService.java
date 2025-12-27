package com.example.BagStore.service;

import com.example.BagStore.dto.ContactRequest;
import com.example.BagStore.entity.Contact;
import com.example.BagStore.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public void save(ContactRequest req) {
        Contact contact = new Contact();
        contact.setName(req.getName());
        contact.setEmail(req.getEmail());
        contact.setPhone(req.getPhone());
        contact.setMessage(req.getMessage());

        contactRepository.save(contact);
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public void markAsReplied(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy liên hệ"));

        contact.setReplied(true);
        contactRepository.save(contact);
    }

    public void delete(Long id) {
        contactRepository.deleteById(id);
    }
}

