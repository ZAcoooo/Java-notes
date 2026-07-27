package com.leetcode.tracker.service;

import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExcelImportService {

    private static final Pattern PROBLEM_PATTERN = Pattern.compile("^(\\d+)\\.\\s*(.+?)(?:\\n|$)", Pattern.MULTILINE);

    private final ProblemRepository problemRepository;
    private final AttemptRepository attemptRepository;

    public ExcelImportService(ProblemRepository problemRepository, AttemptRepository attemptRepository) {
        this.problemRepository = problemRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional
    public Map<String, Object> importExcel(MultipartFile file) throws Exception {
        int imported = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        try (InputStream in = file.getInputStream(); Workbook workbook = new XSSFWorkbook(in)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Cell dateCell = row.getCell(0);
                if (dateCell == null) continue;

                LocalDate attemptDate = parseDate(dateCell);
                if (attemptDate == null) continue;

                for (int col = 1; col <= row.getLastCellNum(); col++) {
                    Cell cell = row.getCell(col);
                    if (cell == null || cell.getCellType() == CellType.BLANK) continue;

                    String text = formatter.formatCellValue(cell).trim();
                    if (text.isEmpty()) continue;

                    try {
                        boolean review = isReviewStyle(cell);
                        boolean stuck = isStuckStyle(cell);
                        importCell(text, attemptDate, review, stuck);
                        imported++;
                    } catch (Exception e) {
                        skipped++;
                        errors.add("行" + (row.getRowNum() + 1) + "列" + col + ": " + e.getMessage());
                    }
                }
            }
        }

        return Map.of(
                "imported", imported,
                "skipped", skipped,
                "errors", errors
        );
    }

    private void importCell(String text, LocalDate date, boolean review, boolean stuck) {
        Matcher m = PROBLEM_PATTERN.matcher(text);
        if (!m.find()) {
            throw new IllegalArgumentException("无法解析题号: " + text.substring(0, Math.min(30, text.length())));
        }

        int leetcodeId = Integer.parseInt(m.group(1));
        String titlePart = m.group(2).trim();
        String notes = text.substring(m.end()).trim();

        Problem problem = problemRepository.findByLeetcodeId(leetcodeId)
                .orElseGet(() -> createProblemFromImport(leetcodeId, titlePart));

        int nextNo = attemptRepository.findTopByProblemIdOrderByAttemptNoDesc(problem.getId())
                .map(a -> a.getAttemptNo() + 1)
                .orElse(1);

        Attempt attempt = new Attempt();
        attempt.setProblem(problem);
        attempt.setAttemptNo(nextNo);
        attempt.setAttemptType(review ? AttemptType.REVIEW : AttemptType.FIRST);
        attempt.setAttemptDate(date);
        attempt.setResult(AttemptResult.AC);
        attempt.setNotes(notes.isEmpty() ? null : notes);
        attempt.setMood(stuck ? AttemptMood.STUCK : AttemptMood.NORMAL);
        attemptRepository.save(attempt);

        if (problem.getStatus() == ProblemStatus.NOT_STARTED) {
            problem.setStatus(ProblemStatus.IN_PROGRESS);
            problemRepository.save(problem);
        }
    }

    private Problem createProblemFromImport(int leetcodeId, String title) {
        Problem problem = new Problem();
        problem.setLeetcodeId(leetcodeId);
        problem.setTitle(title);
        problem.setOfficialDifficulty(OfficialDifficulty.MEDIUM);
        problem.setCategory("其他");
        problem.setCustom(true);
        return problemRepository.save(problem);
    }

    private LocalDate parseDate(Cell cell) {
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        return null;
    }

    private boolean isReviewStyle(Cell cell) {
        CellStyle style = cell.getCellStyle();
        if (style == null) return false;
        Color color = style.getFillForegroundColorColor();
        if (color instanceof org.apache.poi.xssf.usermodel.XSSFColor) {
            org.apache.poi.xssf.usermodel.XSSFColor xssfColor = (org.apache.poi.xssf.usermodel.XSSFColor) color;
            byte[] rgb = xssfColor.getRGB();
            if (rgb != null && rgb.length >= 3) {
                int r = rgb[0] & 0xFF;
                int g = rgb[1] & 0xFF;
                int b = rgb[2] & 0xFF;
                return b > r && b > g && b > 150;
            }
        }
        return false;
    }

    private boolean isStuckStyle(Cell cell) {
        CellStyle style = cell.getCellStyle();
        if (style == null) return false;
        Font font = cell.getSheet().getWorkbook().getFontAt(style.getFontIndexAsInt());
        return font != null && font.getColor() == Font.COLOR_RED;
    }
}
