package com.leetcode.tracker.controller;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.service.AttemptService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/problems/{problemId}/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public AttemptDto create(@PathVariable Long problemId,
                                 @Valid @RequestBody CreateAttemptRequest req) {
        return attemptService.create(problemId, req);
    }

    @PutMapping("/attempts/{attemptId}")
    public AttemptDto update(@PathVariable Long attemptId,
                           @Valid @RequestBody UpdateAttemptRequest req) {
        return attemptService.update(attemptId, req);
    }

    @DeleteMapping("/attempts/{attemptId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long attemptId) {
        attemptService.delete(attemptId);
    }

    @GetMapping("/attempts/by-date")
    public List<AttemptDto> byDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attemptService.listByDate(date);
    }
}
