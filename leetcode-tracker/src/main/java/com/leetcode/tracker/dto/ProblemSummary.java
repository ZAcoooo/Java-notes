package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record ProblemSummary(
        Long id,
        Integer leetcodeId,
        String title,
        String url,
        OfficialDifficulty officialDifficulty,
        String category,
        ProblemStatus status,
        Integer myDifficulty,
        int attemptCount,
        LocalDate lastAttemptDate,
        int solutionCount,
        boolean custom
) {}
