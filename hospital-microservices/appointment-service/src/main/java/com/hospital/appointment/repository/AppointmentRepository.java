package com.hospital.appointment.repository;

import com.hospital.appointment.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByAppointmentDate(String date);
}
