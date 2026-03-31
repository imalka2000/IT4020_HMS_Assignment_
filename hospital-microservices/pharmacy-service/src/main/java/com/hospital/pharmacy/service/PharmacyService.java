package com.hospital.pharmacy.service;

import com.hospital.pharmacy.model.Medicine;
import com.hospital.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PharmacyService {
    @Autowired
    private MedicineRepository repo;

    public List<Medicine> getAll() {
        return repo.findAll();
    }

    public Optional<Medicine> getById(String id) {
        return repo.findById(id);
    }

    public Medicine create(Medicine m) {
        return repo.save(m);
    }

    public Optional<Medicine> update(String id, Medicine d) {
        return repo.findById(id).map(m -> {
            m.setName(d.getName());
            m.setGenericName(d.getGenericName());
            m.setCategory(d.getCategory());
            m.setManufacturer(d.getManufacturer());
            m.setPrice(d.getPrice());
            m.setStockQuantity(d.getStockQuantity());
            m.setExpiryDate(d.getExpiryDate());
            m.setDescription(d.getDescription());
            return repo.save(m);
        });
    }

    public Optional<Medicine> updateStock(String id, Integer qty) {
        return repo.findById(id).map(m -> {
            m.setStockQuantity(qty);
            return repo.save(m);
        });
    }

    public boolean delete(String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Medicine> byCategory(String c) {
        return repo.findByCategoryIgnoreCase(c);
    }

    public List<Medicine> search(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    public List<Medicine> inStock() {
        return repo.findByStockQuantityGreaterThan(0);
    }
}
