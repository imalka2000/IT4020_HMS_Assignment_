package com.hospital.patient.service;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PatientService {
    @Autowired private PatientRepository repo;
    @Autowired private SequenceGeneratorService sequenceGenerator;

    public List<Patient> getAll() { return repo.findAll(); }
    public Optional<Patient> getById(String id) { return repo.findById(id); }

    public Patient create(Patient p) {
        p.setCode("PAT-" + sequenceGenerator.generateSequence(Patient.class.getSimpleName()));
        return repo.save(p);
    }
    public Optional<Patient> update(String id, Patient d) {
        return repo.findById(id).map(p -> {
            p.setFirstName(d.getFirstName()); p.setLastName(d.getLastName());
            p.setEmail(d.getEmail()); p.setPhone(d.getPhone());
            p.setDateOfBirth(d.getDateOfBirth()); p.setGender(d.getGender());
            p.setAddress(d.getAddress()); p.setBloodGroup(d.getBloodGroup());
            return repo.save(p);
        });
    }
    public boolean delete(String id) {
        if (repo.existsById(id)) { repo.deleteById(id); return true; } return false;
    }
    public List<Patient> search(String lastName) { return repo.findByLastNameContainingIgnoreCase(lastName); }
}
