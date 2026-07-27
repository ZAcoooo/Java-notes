package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.*;

import java.time.LocalDate;

public record AttemptDto(
        Long id,
        Long problemId,
        Integer leetcodeId,
        String problemTitle,
        String problemUrl,
        Integer attemptNo,
        AttemptType attemptType,
        LocalDate attemptDate,
        AttemptResult result,
        Integer myDifficulty,
        AttemptMood mood,
        String notes,
        Long solutionUsedId,
        String solutionUsedName,
        Integer durationMinutes
) {
    public static AttemptDto from(Attempt a) {
        Problem p = a.getProblem();
        return new AttemptDto(
                a.getId(),
                p.getId(),
                p.getLeetcodeId(),
                p.getTitle(),
                p.getUrl(),
                a.getAttemptNo(),
                a.getAttemptType(),
                a.getAttemptDate(),
                a.getResult(),
                a.getMyDifficulty(),
                a.getMood(),
                a.getNotes(),
                a.getSolutionUsed() != null ? a.getSolutionUsed().getId() : null,
                a.getSolutionUsed() != null ? a.getSolutionUsed().getName() : null,
                a.getDurationMinutes()
        );
    }
}
