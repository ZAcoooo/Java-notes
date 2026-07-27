package com.leetcode.tracker.controller;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.entity.ProblemStatus;
import com.leetcode.tracker.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public List<ProblemSummary> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProblemStatus status,
            @RequestParam(required = false) String keyword) {
        return problemService.listAll(category, status, keyword);
    }

    @PostMapping
    @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public ProblemDetail create(@Valid @RequestBody CreateProblemRequest req) {
        return problemService.create(req);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return problemService.listCategories();
    }

    @GetMapping("/{id}")
    public ProblemDetail detail(@PathVariable Long id) {
        return problemService.getDetail(id);
    }

    @PatchMapping("/{id}")
    public ProblemDetail update(@PathVariable Long id, @RequestBody UpdateProblemRequest req) {
        problemService.updateProblem(id, req);
        return problemService.getDetail(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        problemService.delete(id);
    }
}
