package com.leetcode.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts", indexes = {
        @Index(name = "idx_attempt_date", columnList = "attemptDate")
})
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private Integer attemptNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttemptType attemptType;

    @Column(nullable = false)
    private LocalDate attemptDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AttemptResult result = AttemptResult.AC;

    @Column(nullable = false)
    private Integer myDifficulty = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AttemptMood mood = AttemptMood.NORMAL;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id")
    private Solution solutionUsed;

    @Column
    private Integer durationMinutes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        if (attemptDate == null) {
            attemptDate = LocalDate.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public Integer getAttemptNo() { return attemptNo; }
    public void setAttemptNo(Integer attemptNo) { this.attemptNo = attemptNo; }
    public AttemptType getAttemptType() { return attemptType; }
    public void setAttemptType(AttemptType attemptType) { this.attemptType = attemptType; }
    public LocalDate getAttemptDate() { return attemptDate; }
    public void setAttemptDate(LocalDate attemptDate) { this.attemptDate = attemptDate; }
    public AttemptResult getResult() { return result; }
    public void setResult(AttemptResult result) { this.result = result; }
    public Integer getMyDifficulty() { return myDifficulty; }
    public void setMyDifficulty(Integer myDifficulty) { this.myDifficulty = myDifficulty; }
    public AttemptMood getMood() { return mood; }
    public void setMood(AttemptMood mood) { this.mood = mood; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Solution getSolutionUsed() { return solutionUsed; }
    public void setSolutionUsed(Solution solutionUsed) { this.solutionUsed = solutionUsed; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
