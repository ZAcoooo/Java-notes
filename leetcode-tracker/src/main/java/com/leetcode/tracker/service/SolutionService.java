package com.leetcode.tracker.service;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import com.leetcode.tracker.repository.SolutionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final ProblemRepository problemRepository;

    public SolutionService(SolutionRepository solutionRepository, ProblemRepository problemRepository) {
        this.solutionRepository = solutionRepository;
        this.problemRepository = problemRepository;
    }

    public List<SolutionDto> listByProblem(Long problemId) {
        return solutionRepository.findByProblemIdOrderBySortOrderAscIdAsc(problemId).stream()
                .map(SolutionDto::from)
                .toList();
    }

    @Transactional
    public SolutionDto create(Long problemId, CreateSolutionRequest req) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("题目不存在: " + problemId));

        if (Boolean.TRUE.equals(req.isPrimary())) {
            clearPrimary(problemId);
        }

        Solution solution = new Solution();
        solution.setProblem(problem);
        solution.setName(req.name());
        solution.setApproach(req.approach());
        solution.setTimeComplexity(req.timeComplexity());
        solution.setSpaceComplexity(req.spaceComplexity());
        solution.setCodeSnippet(req.codeSnippet());
        solution.setIsPrimary(req.isPrimary() != null && req.isPrimary());
        solution.setSortOrder(req.sortOrder() != null ? req.sortOrder() : nextSortOrder(problemId));

        return SolutionDto.from(solutionRepository.save(solution));
    }

    @Transactional
    public SolutionDto update(Long solutionId, UpdateSolutionRequest req) {
        Solution solution = solutionRepository.findById(solutionId)
                .orElseThrow(() -> new EntityNotFoundException("解法不存在: " + solutionId));

        if (req.name() != null) solution.setName(req.name());
        if (req.approach() != null) solution.setApproach(req.approach());
        if (req.timeComplexity() != null) solution.setTimeComplexity(req.timeComplexity());
        if (req.spaceComplexity() != null) solution.setSpaceComplexity(req.spaceComplexity());
        if (req.codeSnippet() != null) solution.setCodeSnippet(req.codeSnippet());
        if (req.sortOrder() != null) solution.setSortOrder(req.sortOrder());
        if (req.isPrimary() != null) {
            if (req.isPrimary()) {
                clearPrimary(solution.getProblem().getId());
            }
            solution.setIsPrimary(req.isPrimary());
        }

        return SolutionDto.from(solutionRepository.save(solution));
    }

    @Transactional
    public void delete(Long solutionId) {
        if (!solutionRepository.existsById(solutionId)) {
            throw new EntityNotFoundException("解法不存在: " + solutionId);
        }
        solutionRepository.deleteById(solutionId);
    }

    private void clearPrimary(Long problemId) {
        solutionRepository.findByProblemIdOrderBySortOrderAscIdAsc(problemId).forEach(s -> {
            s.setIsPrimary(false);
            solutionRepository.save(s);
        });
    }

    private int nextSortOrder(Long problemId) {
        List<Solution> list = solutionRepository.findByProblemIdOrderBySortOrderAscIdAsc(problemId);
        return list.isEmpty() ? 0 : list.get(list.size() - 1).getSortOrder() + 1;
    }
}
