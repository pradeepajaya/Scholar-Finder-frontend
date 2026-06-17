package com.scholarfinder.notification.dto;

public class AudienceCountsResponse {

    private long all;
    private long students;
    private long institutions;

    public AudienceCountsResponse() {}

    public AudienceCountsResponse(long students, long institutions) {
        this.students = students;
        this.institutions = institutions;
        this.all = students + institutions;
    }

    public long getAll() {
        return all;
    }

    public void setAll(long all) {
        this.all = all;
    }

    public long getStudents() {
        return students;
    }

    public void setStudents(long students) {
        this.students = students;
    }

    public long getInstitutions() {
        return institutions;
    }

    public void setInstitutions(long institutions) {
        this.institutions = institutions;
    }
}
