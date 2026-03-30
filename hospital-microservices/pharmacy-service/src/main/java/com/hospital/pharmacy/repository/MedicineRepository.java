package com.hospital.pharmacy.repository;
import com.hospital.pharmacy.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {
    List<Medicine> findByCategoryIgnoreCase(String category);
    List<Medicine> findByNameContainingIgnoreCase(String name);
    List<Medicine> findByStockQuantityGreaterThan(Integer qty);
}
