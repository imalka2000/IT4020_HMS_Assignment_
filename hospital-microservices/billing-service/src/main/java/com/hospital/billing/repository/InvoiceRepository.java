package com.hospital.billing.repository;

import com.hospital.billing.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    List<Invoice> findByPatientId(String patientId);

    List<Invoice> findByPaymentStatus(String status);
}
