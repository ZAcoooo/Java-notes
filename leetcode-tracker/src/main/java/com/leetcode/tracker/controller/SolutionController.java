package com.leetcode.tracker.controller;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.service.SolutionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems/{problemId}/solutions")
@CrossOrigin
public class SolutionController {

    private final SolutionService solutionService;

    public SolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @GetMapping
    public List<SolutionDto> list(@PathVariable Long problemId) {
        return solutionService.listByProblem(problemId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolutionDto create(@PathVariable Long problemId,
                                  @Valid @RequestBody CreateSolutionRequest req) {
        return solutionService.create(problemId, req);
    }

    @PutMapping("/{solutionId}")
    public SolutionDto update(@PathVariable Long problemId,
                                  @PathVariable Long solutionId,
                                  @RequestBody UpdateSolutionRequest req) {
        return solutionService.update(solutionId, req);
    }

    @DeleteMapping("/{solutionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long problemId, @PathVariable Long solutionId) {
        solutionService.delete(solutionId);
    }
}
