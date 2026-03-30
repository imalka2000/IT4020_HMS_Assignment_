package com.hospital.labtest.service;
import com.hospital.labtest.model.LabTest;
import com.hospital.labtest.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LabTestService {
    @Autowired private LabTestRepository repo;
    public List<LabTest> getAll() { return repo.findAll(); }
    public Optional<LabTest> getById(String id) { return repo.findById(id); }
    public LabTest create(LabTest t) { t.setStatus("ORDERED"); return repo.save(t); }
    public Optional<LabTest> update(String id, LabTest d) {
        return repo.findById(id).map(t -> {
            t.setPatientId(d.getPatientId()); t.setDoctorId(d.getDoctorId());
            t.setTestName(d.getTestName()); t.setTestCode(d.getTestCode());
            t.setCategory(d.getCategory()); t.setOrderedDate(d.getOrderedDate());
            t.setCompletedDate(d.getCompletedDate()); t.setResult(d.getResult());
            t.setNormalRange(d.getNormalRange()); t.setStatus(d.getStatus());
            t.setTechnicianNotes(d.getTechnicianNotes()); return repo.save(t);
        });
    }
    public Optional<LabTest> updateResult(String id, String result, String notes, String date) {
        return repo.findById(id).map(t -> {
            t.setResult(result); t.setTechnicianNotes(notes);
            t.setCompletedDate(date); t.setStatus("COMPLETED"); return repo.save(t);
        });
    }
    public Optional<LabTest> updateStatus(String id, String status) {
        return repo.findById(id).map(t -> { t.setStatus(status); return repo.save(t); });
    }
    public boolean delete(String id) {
        if (repo.existsById(id)) { repo.deleteById(id); return true; } return false; }
    public List<LabTest> byPatient(String pid) { return repo.findByPatientId(pid); }
    public List<LabTest> byDoctor(String did) { return repo.findByDoctorId(did); }
    public List<LabTest> byStatus(String s) { return repo.findByStatus(s); }
    public List<LabTest> byCategory(String c) { return repo.findByCategoryIgnoreCase(c); }
}
