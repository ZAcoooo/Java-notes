package com.leetcode.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems", indexes = {
        @Index(name = "idx_leetcode_id", columnList = "leetcodeId", unique = true)
})
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer leetcodeId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OfficialDifficulty officialDifficulty;

    @Column(nullable = false, length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProblemStatus status = ProblemStatus.NOT_STARTED;

    @Column(nullable = false)
    private Integer myDifficulty = 0;

    /** true = 用户手动添加，false = Hot100 内置 */
    @Column(nullable = false)
    private Boolean custom = false;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    private List<Solution> solutions = new ArrayList<>();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("attemptDate DESC, id DESC")
    private List<Attempt> attempts = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (url == null || url.isBlank()) {
            url = "https://leetcode.cn/problems/" + slugFromTitle(title) + "/";
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private static String slugFromTitle(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getLeetcodeId() { return leetcodeId; }
    public void setLeetcodeId(Integer leetcodeId) { this.leetcodeId = leetcodeId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public OfficialDifficulty getOfficialDifficulty() { return officialDifficulty; }
    public void setOfficialDifficulty(OfficialDifficulty officialDifficulty) { this.officialDifficulty = officialDifficulty; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public ProblemStatus getStatus() { return status; }
    public void setStatus(ProblemStatus status) { this.status = status; }
    public Integer getMyDifficulty() { return myDifficulty; }
    public void setMyDifficulty(Integer myDifficulty) { this.myDifficulty = myDifficulty; }
    public Boolean getCustom() { return custom; }
    public void setCustom(Boolean custom) { this.custom = custom; }
    public List<Solution> getSolutions() { return solutions; }
    public void setSolutions(List<Solution> solutions) { this.solutions = solutions; }
    public List<Attempt> getAttempts() { return attempts; }
    public void setAttempts(List<Attempt> attempts) { this.attempts = attempts; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
