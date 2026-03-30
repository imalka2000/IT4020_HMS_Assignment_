package com.hospital.labtest.repository;
import com.hospital.labtest.model.LabTest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabTestRepository extends MongoRepository<LabTest, String> {
    List<LabTest> findByPatientId(String patientId);
    List<LabTest> findByDoctorId(String doctorId);
    List<LabTest> findByStatus(String status);
    List<LabTest> findByCategoryIgnoreCase(String category);
}
