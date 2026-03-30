package com.hospital.appointment.controller;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/appointments")
@Tag(name = "Appointment API", description = "Manage appointments — backed by MongoDB")
public class AppointmentController {
    @Autowired private AppointmentService svc;
    @GetMapping @Operation(summary="Get all appointments")
    public ResponseEntity<List<Appointment>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/{id}") @Operation(summary="Get appointment by ID")
    public ResponseEntity<Appointment> getById(@PathVariable String id) {
        return svc.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @PostMapping @Operation(summary="Book appointment")
    public ResponseEntity<Appointment> create(@RequestBody Appointment a) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(a)); }
    @PutMapping("/{id}") @Operation(summary="Update appointment")
    public ResponseEntity<Appointment> update(@PathVariable String id, @RequestBody Appointment a) {
        return svc.update(id, a).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @PatchMapping("/{id}/status") @Operation(summary="Update status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable String id, @RequestParam String status) {
        return svc.updateStatus(id, status).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") @Operation(summary="Cancel appointment")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return svc.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build(); }
    @GetMapping("/patient/{pid}") @Operation(summary="Appointments by patient")
    public ResponseEntity<List<Appointment>> byPatient(@PathVariable String pid) {
        return ResponseEntity.ok(svc.byPatient(pid)); }
    @GetMapping("/doctor/{did}") @Operation(summary="Appointments by doctor")
    public ResponseEntity<List<Appointment>> byDoctor(@PathVariable String did) {
        return ResponseEntity.ok(svc.byDoctor(did)); }
    @GetMapping("/date") @Operation(summary="Appointments by date")
    public ResponseEntity<List<Appointment>> byDate(@RequestParam String date) {
        return ResponseEntity.ok(svc.byDate(date)); }
}
