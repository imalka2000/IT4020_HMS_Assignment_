package com.hospital.labtest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "lab_tests")
public class LabTest {
    @Id
    private String id;
    @Indexed
    private String patientId;
    @Indexed
    private String doctorId;
    private String testName;
    private String testCode;
    @Indexed
    private String category;
    private String orderedDate;
    private String completedDate;
    private String result;
    private String normalRange;
    @Indexed
    private String status;
    private String technicianNotes;

    public LabTest() {
    }

    public LabTest(String id, String patientId, String doctorId, String testName, String testCode, String category,
            String orderedDate, String completedDate, String result, String normalRange, String status,
            String technicianNotes) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.testName = testName;
        this.testCode = testCode;
        this.category = category;
        this.orderedDate = orderedDate;
        this.completedDate = completedDate;
        this.result = result;
        this.normalRange = normalRange;
        this.status = status;
        this.technicianNotes = technicianNotes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestCode() {
        return testCode;
    }

    public void setTestCode(String testCode) {
        this.testCode = testCode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getOrderedDate() {
        return orderedDate;
    }

    public void setOrderedDate(String orderedDate) {
        this.orderedDate = orderedDate;
    }

    public String getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(String completedDate) {
        this.completedDate = completedDate;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getNormalRange() {
        return normalRange;
    }

    public void setNormalRange(String normalRange) {
        this.normalRange = normalRange;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTechnicianNotes() {
        return technicianNotes;
    }

    public void setTechnicianNotes(String technicianNotes) {
        this.technicianNotes = technicianNotes;
    }
}
