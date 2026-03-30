package com.hospital.doctor.controller;
import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/doctors")
@Tag(name = "Doctor API", description = "Manage doctors — backed by MongoDB")
public class DoctorController {
    @Autowired private DoctorService svc;
    @GetMapping @Operation(summary="Get all doctors")
    public ResponseEntity<List<Doctor>> getAll() { return ResponseEntity.ok(svc.getAll()); }
    @GetMapping("/{id}") @Operation(summary="Get doctor by ID")
    public ResponseEntity<Doctor> getById(@PathVariable String id) {
        return svc.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @PostMapping @Operation(summary="Add a new doctor")
    public ResponseEntity<Doctor> create(@RequestBody Doctor d) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(d)); }
    @PutMapping("/{id}") @Operation(summary="Update doctor")
    public ResponseEntity<Doctor> update(@PathVariable String id, @RequestBody Doctor d) {
        return svc.update(id, d).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") @Operation(summary="Remove doctor")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return svc.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build(); }
    @GetMapping("/specialization/{spec}") @Operation(summary="Find by specialization")
    public ResponseEntity<List<Doctor>> bySpec(@PathVariable String spec) {
        return ResponseEntity.ok(svc.bySpecialization(spec)); }
    @GetMapping("/available") @Operation(summary="Get available doctors")
    public ResponseEntity<List<Doctor>> available() { return ResponseEntity.ok(svc.available()); }
}
