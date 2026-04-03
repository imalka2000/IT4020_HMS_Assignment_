package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.model.Medicine;
import com.hospital.pharmacy.service.PharmacyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@Tag(name = "Pharmacy API", description = "Manage medicine inventory — backed by MongoDB")
public class PharmacyController {
    @Autowired
    private PharmacyService svc;

    @GetMapping
    @Operation(summary = "Get all medicines")
    public ResponseEntity<List<Medicine>> getAll() {
        return ResponseEntity.ok(svc.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get medicine by ID")
    public ResponseEntity<Medicine> getById(@PathVariable String id) {
        return svc.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Add medicine")
    public ResponseEntity<Medicine> create(@RequestBody Medicine m) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(m));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update medicine")
    public ResponseEntity<Medicine> update(@PathVariable String id, @RequestBody Medicine m) {
        return svc.update(id, m).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update stock")
    public ResponseEntity<Medicine> updateStock(@PathVariable String id, @RequestParam Integer quantity) {
        return svc.updateStock(id, quantity).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove medicine")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return svc.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/category/{cat}")
    @Operation(summary = "By category")
    public ResponseEntity<List<Medicine>> byCategory(@PathVariable String cat) {
        return ResponseEntity.ok(svc.byCategory(cat));
    }

    @GetMapping("/search")
    @Operation(summary = "Search by name")
    public ResponseEntity<List<Medicine>> search(@RequestParam String name) {
        return ResponseEntity.ok(svc.search(name));
    }

    @GetMapping("/in-stock")
    @Operation(summary = "In-stock medicines")
    public ResponseEntity<List<Medicine>> inStock() {
        return ResponseEntity.ok(svc.inStock());
    }
}
