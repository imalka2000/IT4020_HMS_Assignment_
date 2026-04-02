package com.hospital.appointment.service;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AppointmentService {
    @Autowired private AppointmentRepository repo;
    @Autowired private SequenceGeneratorService sequenceGenerator;

    public List<Appointment> getAll() { return repo.findAll(); }
    public Optional<Appointment> getById(String id) { return repo.findById(id); }

    public Appointment create(Appointment a) {
        a.setCode("APT-" + sequenceGenerator.generateSequence(Appointment.class.getSimpleName()));
        a.setStatus("SCHEDULED");
        return repo.save(a);
    }
    public Optional<Appointment> update(String id, Appointment d) {
        return repo.findById(id).map(a -> {
            a.setPatientId(d.getPatientId()); a.setDoctorId(d.getDoctorId());
            a.setAppointmentDate(d.getAppointmentDate()); a.setAppointmentTime(d.getAppointmentTime());
            a.setReason(d.getReason()); a.setStatus(d.getStatus()); a.setNotes(d.getNotes());
            return repo.save(a);
        });
    }
    public Optional<Appointment> updateStatus(String id, String status) {
        return repo.findById(id).map(a -> { a.setStatus(status); return repo.save(a); });
    }
    public boolean delete(String id) {
        if (repo.existsById(id)) { repo.deleteById(id); return true; } return false; }
    public List<Appointment> byPatient(String pid) { return repo.findByPatientId(pid); }
    public List<Appointment> byDoctor(String did) { return repo.findByDoctorId(did); }
    public List<Appointment> byDate(String date) { return repo.findByAppointmentDate(date); }
}
