package com.hospital.billing.controller;

import com.hospital.billing.model.Invoice;
import com.hospital.billing.service.BillingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Billing API", description = "Manage invoices — backed by MongoDB")
public class BillingController {
    @Autowired
    private BillingService svc;

    @GetMapping
    @Operation(summary = "Get all invoices")
    public ResponseEntity<List<Invoice>> getAll() {
        return ResponseEntity.ok(svc.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<Invoice> getById(@PathVariable String id) {
        return svc.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Generate invoice")
    public ResponseEntity<Invoice> create(@RequestBody Invoice inv) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(inv));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update invoice")
    public ResponseEntity<Invoice> update(@PathVariable String id, @RequestBody Invoice d) {
        return svc.update(id, d).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/pay")
    @Operation(summary = "Mark as paid")
    public ResponseEntity<Invoice> markPaid(@PathVariable String id, @RequestParam String paymentMethod) {
        return svc.markPaid(id, paymentMethod).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete invoice")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return svc.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{pid}")
    @Operation(summary = "Invoices by patient")
    public ResponseEntity<List<Invoice>> byPatient(@PathVariable String pid) {
        return ResponseEntity.ok(svc.byPatient(pid));
    }

    @GetMapping("/status")
    @Operation(summary = "Invoices by status")
    public ResponseEntity<List<Invoice>> byStatus(@RequestParam String status) {
        return ResponseEntity.ok(svc.byStatus(status));
    }
}
