package com.leetcode.tracker.service;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import com.leetcode.tracker.repository.SolutionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final AttemptRepository attemptRepository;
    private final SolutionRepository solutionRepository;

    public ProblemService(ProblemRepository problemRepository,
                          AttemptRepository attemptRepository,
                          SolutionRepository solutionRepository) {
        this.problemRepository = problemRepository;
        this.attemptRepository = attemptRepository;
        this.solutionRepository = solutionRepository;
    }

    public List<ProblemSummary> listAll(String category, ProblemStatus status, String keyword) {
        return problemRepository.findAll().stream()
                .filter(p -> category == null || category.isBlank() || category.equals(p.getCategory()))
                .filter(p -> status == null || status == p.getStatus())
                .filter(p -> matchesKeyword(p, keyword))
                .sorted(Comparator.comparing(Problem::getLeetcodeId))
                .map(this::toSummary)
                .toList();
    }

    public ProblemDetail getDetail(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("题目不存在: " + id));
        return toDetail(problem);
    }

    @Transactional
    public ProblemDetail create(CreateProblemRequest req) {
        if (problemRepository.existsByLeetcodeId(req.leetcodeId())) {
            throw new IllegalArgumentException("题号 " + req.leetcodeId() + " 已存在");
        }
        Problem problem = new Problem();
        problem.setLeetcodeId(req.leetcodeId());
        problem.setTitle(req.title().trim());
        problem.setUrl(req.url() != null && !req.url().isBlank() ? req.url().trim() : null);
        problem.setOfficialDifficulty(req.officialDifficulty());
        problem.setCategory(req.category().trim());
        problem.setCustom(true);
        problem.setStatus(ProblemStatus.NOT_STARTED);
        return toDetail(problemRepository.save(problem));
    }

    @Transactional
    public void delete(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new EntityNotFoundException("题目不存在: " + id);
        }
        problemRepository.deleteById(id);
    }

    @Transactional
    public Problem updateProblem(Long id, UpdateProblemRequest req) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("题目不存在: " + id));
        if (req.status() != null) {
            problem.setStatus(req.status());
        }
        if (req.myDifficulty() != null) {
            problem.setMyDifficulty(req.myDifficulty());
        }
        if (req.url() != null && !req.url().isBlank()) {
            problem.setUrl(req.url());
        }
        return problemRepository.save(problem);
    }

    public List<String> listCategories() {
        return problemRepository.findAll().stream()
                .map(Problem::getCategory)
                .distinct()
                .sorted()
                .toList();
    }

    private boolean matchesKeyword(Problem p, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }
        String k = keyword.trim().toLowerCase();
        return p.getTitle().toLowerCase().contains(k)
                || String.valueOf(p.getLeetcodeId()).contains(k);
    }

    private ProblemSummary toSummary(Problem p) {
        List<Attempt> attempts = attemptRepository.findByProblemIdOrderByAttemptDateDescIdDesc(p.getId());
        LocalDate lastDate = attempts.isEmpty() ? null : attempts.get(0).getAttemptDate();
        int solutionCount = solutionRepository.findByProblemIdOrderBySortOrderAscIdAsc(p.getId()).size();
        return new ProblemSummary(
                p.getId(), p.getLeetcodeId(), p.getTitle(), p.getUrl(),
                p.getOfficialDifficulty(), p.getCategory(), p.getStatus(), p.getMyDifficulty(),
                attempts.size(), lastDate, solutionCount,
                Boolean.TRUE.equals(p.getCustom())
        );
    }

    private ProblemDetail toDetail(Problem p) {
        List<SolutionDto> solutions = solutionRepository
                .findByProblemIdOrderBySortOrderAscIdAsc(p.getId()).stream()
                .map(SolutionDto::from)
                .toList();
        List<AttemptDto> attempts = attemptRepository
                .findByProblemIdOrderByAttemptDateDescIdDesc(p.getId()).stream()
                .map(AttemptDto::from)
                .toList();
        return new ProblemDetail(
                p.getId(), p.getLeetcodeId(), p.getTitle(), p.getUrl(),
                p.getOfficialDifficulty(), p.getCategory(), p.getStatus(), p.getMyDifficulty(),
                solutions, attempts,
                Boolean.TRUE.equals(p.getCustom())
        );
    }
}
