package com.hospital.doctor.service;
import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DoctorService {
    @Autowired private DoctorRepository repo;
    @Autowired private SequenceGeneratorService sequenceGenerator;

    public List<Doctor> getAll() { return repo.findAll(); }
    public Optional<Doctor> getById(String id) { return repo.findById(id); }

    public Doctor create(Doctor d) {
        d.setCode("DOC-" + sequenceGenerator.generateSequence(Doctor.class.getSimpleName()));
        return repo.save(d);
    }
    public Optional<Doctor> update(String id, Doctor details) {
        return repo.findById(id).map(d -> {
            d.setFirstName(details.getFirstName()); d.setLastName(details.getLastName());
            d.setSpecialization(details.getSpecialization()); d.setEmail(details.getEmail());
            d.setPhone(details.getPhone()); d.setLicenseNumber(details.getLicenseNumber());
            d.setDepartment(details.getDepartment()); d.setAvailable(details.isAvailable());
            return repo.save(d);
        });
    }
    public boolean delete(String id) {
        if (repo.existsById(id)) { repo.deleteById(id); return true; } return false; }
    public List<Doctor> bySpecialization(String s) { return repo.findBySpecializationIgnoreCase(s); }
    public List<Doctor> available() { return repo.findByAvailableTrue(); }
}
