package com.hospital.patient.repository;
import com.hospital.patient.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByLastNameContainingIgnoreCase(String lastName);
}
