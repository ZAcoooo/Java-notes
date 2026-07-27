package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateAttemptRequest(
        @NotNull AttemptType attemptType,
        @NotNull LocalDate attemptDate,
        AttemptResult result,
        @Min(0) @Max(5) Integer myDifficulty,
        AttemptMood mood,
        String notes,
        Long solutionUsedId,
        @Min(0) Integer durationMinutes
) {}
