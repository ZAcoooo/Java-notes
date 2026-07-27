package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.OfficialDifficulty;
import jakarta.validation.constraints.*;

public record CreateProblemRequest(
        @NotNull @Min(1) Integer leetcodeId,
        @NotBlank @Size(max = 200) String title,
        @Size(max = 500) String url,
        @NotNull OfficialDifficulty officialDifficulty,
        @NotBlank @Size(max = 50) String category
) {}
