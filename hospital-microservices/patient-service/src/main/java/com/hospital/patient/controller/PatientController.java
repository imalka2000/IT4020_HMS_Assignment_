package com.hospital.patient.controller;
import com.hospital.patient.model.Patient;
import com.hospital.patient.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/patients")
@Tag(name = "Patient API", description = "Manage hospital patients — backed by MongoDB")
public class PatientController {
    @Autowired private PatientService svc;
    @GetMapping @Operation(summary="Get all patients")
    public ResponseEntity<List<Patient>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/{id}") @Operation(summary="Get patient by ID")
    public ResponseEntity<Patient> getById(@PathVariable String id) {
        return svc.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @PostMapping @Operation(summary="Register new patient")
    public ResponseEntity<Patient> create(@RequestBody Patient p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(p)); }
    @PutMapping("/{id}") @Operation(summary="Update patient")
    public ResponseEntity<Patient> update(@PathVariable String id, @RequestBody Patient p) {
        return svc.update(id, p).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") @Operation(summary="Delete patient")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return svc.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build(); }
    @GetMapping("/search") @Operation(summary="Search by last name")
    public ResponseEntity<List<Patient>> search(@RequestParam String lastName) {
        return ResponseEntity.ok(svc.search(lastName)); }
}
