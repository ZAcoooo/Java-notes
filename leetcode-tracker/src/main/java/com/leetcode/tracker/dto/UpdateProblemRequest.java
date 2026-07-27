package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.ProblemStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateProblemRequest(
        ProblemStatus status,
        @Min(0) @Max(5) Integer myDifficulty,
        @Size(max = 500) String url
) {}
