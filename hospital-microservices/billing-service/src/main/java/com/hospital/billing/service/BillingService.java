package com.hospital.billing.service;

import com.hospital.billing.model.Invoice;
import com.hospital.billing.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class BillingService {
    @Autowired
    private InvoiceRepository repo;
    @Autowired private SequenceGeneratorService sequenceGenerator;

    public List<Invoice> getAll() {
        return repo.findAll();
    }

    public Optional<Invoice> getById(String id) {
        return repo.findById(id);
    }

    public Invoice create(Invoice inv) {
        if (inv.getConsultationFee() != null || inv.getMedicineFee() != null || inv.getLabFee() != null) {
            double total = (inv.getConsultationFee() != null ? inv.getConsultationFee() : 0)
                    + (inv.getMedicineFee() != null ? inv.getMedicineFee() : 0)
                    + (inv.getLabFee() != null ? inv.getLabFee() : 0);
            inv.setTotalAmount(total);
        }
        if (inv.getPaymentStatus() == null)
            inv.setPaymentStatus("PENDING");
        
        inv.setCode("INV-" + sequenceGenerator.generateSequence(Invoice.class.getSimpleName()));
        return repo.save(inv);
    }

    public Optional<Invoice> update(String id, Invoice d) {
        return repo.findById(id).map(inv -> {
            inv.setPatientId(d.getPatientId());
            inv.setAppointmentId(d.getAppointmentId());
            inv.setInvoiceDate(d.getInvoiceDate());
            inv.setConsultationFee(d.getConsultationFee());
            inv.setMedicineFee(d.getMedicineFee());
            inv.setLabFee(d.getLabFee());
            inv.setTotalAmount(d.getTotalAmount());
            inv.setPaymentStatus(d.getPaymentStatus());
            inv.setPaymentMethod(d.getPaymentMethod());
            return repo.save(inv);
        });
    }

    public Optional<Invoice> markPaid(String id, String method) {
        return repo.findById(id).map(inv -> {
            inv.setPaymentStatus("PAID");
            inv.setPaymentMethod(method);
            return repo.save(inv);
        });
    }

    public boolean delete(String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Invoice> byPatient(String pid) {
        return repo.findByPatientId(pid);
    }

    public List<Invoice> byStatus(String status) {
        return repo.findByPaymentStatus(status);
    }
}
