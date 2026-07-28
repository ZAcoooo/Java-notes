const API = '/api';

const STATUS_LABEL = {
    NOT_STARTED: '未开始', IN_PROGRESS: '进行中', MASTERED: '已掌握', NEED_REVIEW: '需复习'
};
const DIFF_LABEL = { EASY: '简单', MEDIUM: '中等', HARD: '困难' };
const TYPE_LABEL = { FIRST: '第一次', REVIEW: '复习' };
const MOOD_LABEL = { SMOOTH: '顺利', NORMAL: '一般', STUCK: '卡顿' };

let attemptModal, solutionModal, problemModal;
let currentProblemId = null;
let returnToDashboardAfterAttempt = false;
let problemSort = { field: 'leetcodeId', asc: true };
let cachedProblemList = [];

const OFFICIAL_DIFF_RANK = { EASY: 1, MEDIUM: 2, HARD: 3 };

const COMPLEXITY_PRESETS = [
    'O(1)', 'O(log n)', 'O(√n)', 'O(n)', 'O(n log n)', 'O(n²)',
    'O(k)', 'O(k log k)', 'O(n + k)', 'O(nk)', 'O(n log k)',
    'O(mn)', 'O(m+n)', 'O(2^n)'
];

document.addEventListener('DOMContentLoaded', () => {
    if (typeof bootstrap !== 'undefined') {
        attemptModal = new bootstrap.Modal('#attemptModal');
        solutionModal = new bootstrap.Modal('#solutionModal');
        problemModal = new bootstrap.Modal('#problemModal');
    } else {
        console.error('Bootstrap 未加载，弹窗功能不可用');
    }
    document.getElementById('attempt-date').value = todayStr();

    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(el.dataset.view);
        });
    });

    document.getElementById('btn-search').addEventListener('click', loadProblems);
    document.getElementById('filter-keyword').addEventListener('keydown', e => {
        if (e.key === 'Enter') loadProblems();
    });
    document.getElementById('btn-back').addEventListener('click', () => history.back());
    document.getElementById('btn-save-attempt').addEventListener('click', saveAttempt);
    document.getElementById('btn-save-solution').addEventListener('click', saveSolution);
    document.getElementById('btn-import').addEventListener('click', importExcel);
    document.getElementById('btn-add-problem').addEventListener('click', openProblemModal);
    document.getElementById('btn-save-problem').addEventListener('click', saveProblem);
    document.querySelector('.problem-grid-header').addEventListener('click', onProblemSortClick);
    document.getElementById('category-progress').addEventListener('click', onCategoryProgressClick);
    document.getElementById('category-progress').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            onCategoryProgressClick(e);
        }
    });
    updateProblemSortIndicators();

    initComplexityChips();
    initRouter();
});

function onCategoryProgressClick(e) {
    const item = e.target.closest('.category-item[data-category]');
    if (!item) return;
    e.preventDefault();
    openProblemsByCategory(item.dataset.category);
}

function initComplexityChips() {
    document.querySelectorAll('.complexity-chips').forEach(container => {
        const targetId = container.dataset.target;
        COMPLEXITY_PRESETS.forEach(c => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'complexity-chip';
            btn.textContent = c;
            btn.onclick = () => setComplexity(targetId, c);
            container.appendChild(btn);
        });
    });
}

function setComplexity(inputId, value) {
    document.getElementById(inputId).value = value;
}

const APP_TIMEZONE = 'Asia/Shanghai';

function todayStr() {
    return formatDateInTz(new Date());
}

/** 格式化为 YYYY-MM-DD（北京时间） */
function formatDateInTz(date) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE }).format(date);
}

/** 日历日期字符串加减天数（纯日期运算，与后端 LocalDate 一致） */
function shiftDateStr(isoDate, deltaDays) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const t = Date.UTC(y, m - 1, d + deltaDays);
    const dt = new Date(t);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

/* ── 路由：支持浏览器前进/后退 ── */
function initRouter() {
    window.addEventListener('popstate', () => {
        applyRoute(getRouteFromLocation());
    });

    const route = getRouteFromLocation();
    if (!location.hash) {
        history.replaceState(route, '', buildHash(route));
    }
    applyRoute(route);
}

function getRouteFromLocation() {
    if (history.state && history.state.view) {
        return history.state;
    }
    return parseHash(location.hash);
}

function parseHash(hash) {
    const raw = (hash || '').replace(/^#/, '') || '/dashboard';
    const [pathPart, queryPart] = raw.split('?');
    const path = pathPart || '/dashboard';
    const params = new URLSearchParams(queryPart || '');
    const m = path.match(/^\/problem\/(\d+)$/);
    if (m) return { view: 'detail', id: +m[1] };
    if (path === '/problems') {
        return { view: 'problems', category: params.get('category') || null };
    }
    return { view: 'dashboard' };
}

function buildHash(route) {
    if (route.view === 'detail' && route.id) return `#/problem/${route.id}`;
    if (route.view === 'problems') {
        if (route.category) {
            return `#/problems?category=${encodeURIComponent(route.category)}`;
        }
        return '#/problems';
    }
    return '#/dashboard';
}

async function navigateTo(view, { id = null, category = null, replace = false } = {}) {
    const route = { view, id, category };
    const hash = buildHash(route);
    if (replace) {
        history.replaceState(route, '', hash);
    } else {
        history.pushState(route, '', hash);
    }
    await applyRoute(route);
}

function activateView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('d-none'));
    document.getElementById('view-' + name).classList.remove('d-none');
    document.querySelectorAll('.nav-pill').forEach(el => {
        el.classList.toggle('active', el.dataset.view === name);
    });
}

async function applyRoute(route) {
    const { view, id, category } = route;
    activateView(view);
    if (view === 'dashboard') {
        await loadDashboard();
    } else if (view === 'problems') {
        await loadCategories();
        const catSel = document.getElementById('filter-category');
        if (category) {
            catSel.value = category;
            if (catSel.value !== category) {
                // 分类下拉尚未包含该项时强制写入
                catSel.insertAdjacentHTML('beforeend',
                    `<option value="${esc(category)}">${esc(category)}</option>`);
                catSel.value = category;
            }
        }
        await loadProblems();
    } else if (view === 'detail' && id) {
        await renderDetail(id);
    }
}

async function openProblemsByCategory(category) {
    document.getElementById('filter-keyword').value = '';
    document.getElementById('filter-status').value = '';
    await navigateTo('problems', { category });
}

async function api(path, options = {}) {
    const res = await fetch(API + path, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || res.statusText);
    }
    if (res.status === 204) return null;
    return res.json();
}

async function loadDashboard() {
    let stats;
    try {
        stats = await api('/stats/dashboard');
    } catch (e) {
        console.error('loadDashboard api failed', e);
        showPanelError('pending-review-list', '加载失败：' + e.message);
        showPanelError('today-review-list', '加载失败：' + e.message);
        return;
    }

    try {
        const pct = stats.totalProblems ? Math.round(stats.attemptedProblems / stats.totalProblems * 100) : 0;
        const heatmap = stats.activityHeatmap || [];
        const yearTotal = heatmap.reduce((s, d) => s + d.count, 0);
        const streak = calcStreak(heatmap);

        document.getElementById('hero-subtitle').textContent =
            streak > 0 ? `已连续刷题 ${streak} 天，继续保持 🔥` : '记录每一次进步';

        renderProgressRing(pct, stats.attemptedProblems, stats.totalProblems);

        document.getElementById('stats-cards').innerHTML = `
        <div class="stat-card">
            <div class="stat-icon teal">📊</div>
            <div class="stat-body">
                <div class="value">${stats.attemptedProblems}<span class="text-secondary fs-6 fw-normal">/${stats.totalProblems}</span></div>
                <div class="label">已刷题目 · ${pct}%</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon green">✅</div>
            <div class="stat-body">
                <div class="value">${stats.masteredProblems}</div>
                <div class="label">已掌握</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon orange">🔥</div>
            <div class="stat-body">
                <div class="value">${stats.todayAttempts}</div>
                <div class="label">今日刷题</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon gray">📋</div>
            <div class="stat-body">
                <div class="value">${stats.totalProblems - stats.attemptedProblems}</div>
                <div class="label">未开始</div>
            </div>
        </div>`;

        renderPendingReview(stats.pendingReview || []);
        renderTodayReview(stats.todayReviews || [], stats.todayDate);

        const sorted = [...(stats.categoryProgress || [])].sort((a, b) => {
            const pa = a.total ? a.attempted / a.total : 0;
            const pb = b.total ? b.attempted / b.total : 0;
            return pb - pa || b.attempted - a.attempted;
        });

        document.getElementById('category-progress').innerHTML = sorted.length
            ? `<div class="category-grid">${sorted.map(c => {
                const p = c.total ? Math.round(c.attempted / c.total * 100) : 0;
                const done = p >= 100;
                return `<div class="category-item" role="button" tabindex="0"
                    data-category="${esc(c.category)}"
                    title="查看「${esc(c.category)}」题目">
                    <div class="category-item-head">
                        <span class="category-name">${esc(c.category)}</span>
                        <span class="category-fraction">${c.attempted}/${c.total} · ${p}%</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-bar-fill ${done ? 'done' : ''}" style="width:${p}%"></div>
                    </div>
                </div>`;
            }).join('')}</div>`
            : '<p class="text-muted mb-0">暂无数据</p>';

        renderActivityHeatmap(heatmap, yearTotal, streak);
    } catch (e) {
        console.error('loadDashboard render failed', e);
        showPanelError('pending-review-list', '渲染失败，请强制刷新页面 (Ctrl+F5)');
        showPanelError('today-review-list', '渲染失败，请强制刷新页面 (Ctrl+F5)');
    }
}

function showPanelError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = `<p class="text-danger mb-0">${esc(message)}</p>`;
}

function diffClass(difficulty) {
    return difficulty ? String(difficulty).toLowerCase() : 'medium';
}

function diffLabel(difficulty) {
    return DIFF_LABEL[difficulty] || DIFF_LABEL[String(difficulty || '').toUpperCase()] || '未知';
}

function renderPendingReview(items) {
    const listEl = document.getElementById('pending-review-list');
    const descEl = document.getElementById('pending-review-desc');
    if (!listEl || !descEl) return;

    if (!items.length) {
        descEl.textContent = '暂无待复习题目，近 7 天内刷过的题不会出现在列表';
        listEl.innerHTML = '<p class="text-muted mb-0">去「题目列表」刷几道题，或今天已复习完毕 🎉</p>';
        return;
    }

    descEl.textContent = `当前 ${items.length} 道，优先次数少，其次最久未刷`;
    listEl.innerHTML = `<div class="review-grid">${items.map((p, i) => `
        <div class="review-card" onclick="openDetail(${p.id})">
            <div class="review-rank">${i + 1}</div>
            <div class="review-body">
                <div class="review-title">${p.leetcodeId}. ${esc(p.title)}</div>
                <div class="review-meta">
                    <span class="badge bg-light text-dark">${esc(p.category)}</span>
                    <span class="diff-${diffClass(p.officialDifficulty)} ms-1">${diffLabel(p.officialDifficulty)}</span>
                </div>
                <div class="review-stale">
                    ${p.daysSince} 天前刷过 · 共 ${p.attemptCount} 次
                    <span class="text-muted">（${formatAttemptDate(p.lastAttemptDate)}）</span>
                </div>
            </div>
            <div class="review-actions">
                <a href="${esc(p.url)}" target="_blank" class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation()">LeetCode</a>
                <button class="btn btn-sm btn-accent" onclick="event.stopPropagation();quickReview(${p.id})">去复习</button>
            </div>
        </div>
    `).join('')}</div>`;
}

function formatAttemptDate(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value.length >= 3) {
        const [y, m, d] = value;
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return String(value);
}

function renderTodayReview(items, todayDate) {
    const titleEl = document.getElementById('today-review-title');
    const listEl = document.getElementById('today-review-list');
    if (!titleEl || !listEl) return;

    const dateLabel = todayDate ? formatDateLabel(todayDate) : '今日';

    titleEl.textContent = `今日复习 · ${dateLabel}`;

    if (!items.length) {
        listEl.innerHTML = '<p class="text-muted mb-0">今天还没有复习记录，从上方「待复习」选题开始吧</p>';
        return;
    }

    listEl.innerHTML = `<ul class="today-review-list">${items.map(r => `
        <li class="today-review-item" onclick="openDetail(${r.problemId})">
            <span class="today-review-check">✓</span>
            <span class="today-review-name">${r.leetcodeId}. ${esc(r.title)}</span>
            <span class="today-review-result badge ${r.result === 'AC' ? 'bg-success' : 'bg-secondary'}">${esc(r.result)}</span>
            <a href="${esc(r.url)}" target="_blank" class="btn btn-sm btn-link" onclick="event.stopPropagation()">LeetCode ↗</a>
        </li>
    `).join('')}</ul>`;
}

function formatDateLabel(isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number);
    return `${m} 月 ${d} 日`;
}

async function quickReview(problemId) {
    await openDetail(problemId);
}

function renderProgressRing(pct, done, total) {
    const r = 52, c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    document.getElementById('hero-progress').innerHTML = `
        <div style="position:relative;width:120px;height:120px">
            <svg class="progress-ring" width="120" height="120" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#00b8a3"/>
                        <stop offset="100%" stop-color="#00e5c0"/>
                    </linearGradient>
                </defs>
                <circle class="progress-ring-bg" cx="60" cy="60" r="${r}"/>
                <circle class="progress-ring-fill" cx="60" cy="60" r="${r}"
                    stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
            </svg>
            <div class="ring-label">
                <span class="ring-pct">${pct}%</span>
                <span class="ring-caption">${done}/${total}</span>
            </div>
        </div>`;
}

function calcStreak(dailyData) {
    if (!dailyData.length) return 0;
    const map = Object.fromEntries(dailyData.map(d => [d.date, d.count]));
    let streak = 0;
    const today = todayStr();
    for (let i = 0; i < 365; i++) {
        const key = shiftDateStr(today, -i);
        if ((map[key] || 0) > 0) streak++;
        else if (i > 0) break;
    }
    return streak;
}

/** 力扣个人主页风格刷题热力图（SVG，按月拆周 + 月间距） */
function renderActivityHeatmap(dailyData, yearTotal, streak = 0) {
    const countMap = Object.fromEntries(dailyData.map(d => [d.date, d.count]));
    const activeDays = dailyData.filter(d => d.count > 0).length;
    const today = new Date();
    const todayKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const todayCount = countMap[todayKey] || 0;
    const mount = document.getElementById('activity-heatmap');

    if (!dailyData.length) {
        mount.innerHTML = `
            <div class="lc-heatmap">
                <div class="lc-heatmap-head">
                    <div class="lc-heatmap-title">过去一年共刷题 <strong>0</strong> 次</div>
                </div>
                <p class="text-muted mb-0">暂无刷题记录</p>
            </div>`;
        return;
    }

    const { svg, width, height } = buildLeetCodeHeatmapSvg(dailyData, countMap);

    mount.innerHTML = `
        <div class="lc-heatmap">
            <div class="lc-heatmap-head">
                <div class="lc-heatmap-title">过去一年共刷题 <strong>${yearTotal}</strong> 次</div>
                <div class="lc-heatmap-stats">
                    <span>累计刷题天数: <b>${activeDays}</b></span>
                    <span>连续刷题: <b>${streak}</b></span>
                    <span>今日: <b>${todayCount}</b></span>
                </div>
            </div>
            <div class="heatmap-container">
                <div class="heatmap-svg-wrap">${svg}</div>
            </div>
            <div class="lc-heatmap-foot">
                <span class="lc-heatmap-hint">点击日期查看当天题目</span>
                <div class="heatmap-legend">
                    <span class="legend-label">少</span>
                    <span class="heatmap-cell level-0"></span>
                    <span class="heatmap-cell level-1"></span>
                    <span class="heatmap-cell level-2"></span>
                    <span class="heatmap-cell level-3"></span>
                    <span class="heatmap-cell level-4"></span>
                    <span class="legend-label">多</span>
                </div>
            </div>
        </div>`;

    mount.querySelectorAll('rect.heatmap-day[data-date]').forEach(cell => {
        cell.addEventListener('mouseenter', showHeatmapTooltip);
        cell.addEventListener('mouseleave', hideHeatmapTooltip);
        cell.addEventListener('click', () => showHeatmapDayDetail(cell.dataset.date));
    });
}

/**
 * 对齐力扣 SVG 结构：
 * - 周日为一周第一天（上→下：日一二三四五六）
 * - 跨月的周拆成两列，分别放在相邻月份里
 * - 月与月之间额外留白（周起点间距约 15.95，月内为 11.52）
 */
function buildLeetCodeHeatmapSvg(dailyData, countMap) {
    // 对齐力扣 SVG 尺寸
    const CELL = 8.86;
    const STEP = 11.52;
    const MONTH_WEEK_GAP = 15.95;
    const LABEL_Y = 97.14;
    const LABEL_EST_W = 28; // 「10月」大约宽度，过窄的月块不画标签

    const start = parseDate(dailyData[0].date);
    const end = parseDate(dailyData[dailyData.length - 1].date);

    const months = [];
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= endMonth) {
        const y = cursor.getFullYear();
        const m = cursor.getMonth();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const weekMap = new Map();

        for (let day = 1; day <= daysInMonth; day++) {
            const dt = new Date(y, m, day);
            if (dt < start || dt > end) continue;
            const ds = formatDate(dt);
            const weekStart = startOfWeekSunday(dt);
            const key = formatDate(weekStart);
            if (!weekMap.has(key)) {
                weekMap.set(key, Array(7).fill(null));
            }
            weekMap.get(key)[dt.getDay()] = { date: ds, count: countMap[ds] || 0 };
        }

        if (weekMap.size) {
            const weeks = [...weekMap.entries()]
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([, slots]) => slots);
            months.push({ year: y, month: m, weeks });
        }

        cursor = new Date(y, m + 1, 1);
    }

    let x = 0;
    const monthShapes = [];
    const labels = [];
    const monthRanges = [];

    months.forEach((month, mi) => {
        if (mi > 0) x += MONTH_WEEK_GAP - STEP;
        const monthStartX = x;
        const weekGroups = month.weeks.map(slots => {
            const weekX = x;
            const rects = slots.map((slot, wi) => {
                const y = wi * STEP;
                if (!slot) {
                    return `<rect x="${weekX}" y="${y}" width="${CELL}" height="${CELL}" fill="transparent" rx="2" ry="2"></rect>`;
                }
                const level = heatLevel(slot.count);
                const fill = heatmapFill(level);
                return `<rect class="heatmap-day level-${level}${slot.count > 0 ? ' has-data' : ''}" x="${weekX}" y="${y}" width="${CELL}" height="${CELL}" fill="${fill}" rx="2" ry="2" data-date="${slot.date}" data-count="${slot.count}"></rect>`;
            }).join('');
            x += STEP;
            return `<g class="week">${rects}</g>`;
        }).join('');

        monthShapes.push(`<g class="month">${weekGroups}</g>`);
        monthRanges.push({
            month: month.month,
            startX: monthStartX,
            endX: x - STEP + CELL,
            weeks: month.weeks.length
        });
    });

    const width = Math.max(x - STEP + CELL, 100);

    monthRanges.forEach(r => {
        const blockW = r.endX - r.startX;
        // 过窄的月块（如年初/年末残月）不显示标签，避免只露出一个「月」
        if (blockW < LABEL_EST_W || r.weeks < 2) return;
        const labelX = (r.startX + r.endX) / 2;
        if (labelX - LABEL_EST_W / 2 < 0 || labelX + LABEL_EST_W / 2 > width) return;
        labels.push(
            `<text x="${labelX.toFixed(2)}" y="${LABEL_Y}" font-size="11px" fill="#AFB4BD" text-anchor="middle">${r.month + 1}月</text>`
        );
    });

    const height = LABEL_Y + 8;
    const svg = `<svg viewBox="0 0 ${width.toFixed(2)} ${height}" width="100%" class="heatmap-svg" preserveAspectRatio="xMidYMid meet">${monthShapes.join('')}${labels.join('')}</svg>`;
    return { svg, width, height };
}

function startOfWeekSunday(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() - d.getDay());
    return d;
}

function heatmapFill(level) {
    return [
        'var(--fill-tertiary, #eff2f5)',
        '#9be9a8',
        '#40c463',
        '#30a14e',
        '#216e39'
    ][level] || 'var(--fill-tertiary, #eff2f5)';
}

let selectedHeatmapDate = null;

async function showHeatmapDayDetail(date) {
    selectedHeatmapDate = date;
    document.querySelectorAll('rect.heatmap-day.selected').forEach(c => c.classList.remove('selected'));
    const cell = document.querySelector(`rect.heatmap-day[data-date="${date}"]`);
    if (cell) cell.classList.add('selected');

    const panel = document.getElementById('heatmap-day-detail');
    panel.classList.remove('d-none');
    panel.innerHTML = `<p class="text-muted mb-0">加载 ${formatDateLabel(date)} 的刷题记录…</p>`;

    try {
        const items = await api('/attempts/by-date?date=' + date);
        renderHeatmapDayDetail(date, items);
    } catch (e) {
        panel.innerHTML = `<p class="text-danger mb-0">加载失败：${esc(e.message)}</p>`;
    }
}

function renderHeatmapDayDetail(date, items) {
    const panel = document.getElementById('heatmap-day-detail');
    const label = formatDateLabel(date);

    if (!items.length) {
        panel.innerHTML = `
            <div class="heatmap-day-head">
                <h3 class="heatmap-day-title">${label}</h3>
                <span class="text-muted">无刷题记录</span>
            </div>
            <p class="text-muted mb-0">这一天还没有刷题，去「待复习」或「题目列表」开始吧</p>`;
        return;
    }

    if (items[0].problemId == null) {
        panel.innerHTML = `
            <div class="heatmap-day-head">
                <h3 class="heatmap-day-title">${label}</h3>
            </div>
            <p class="text-warning mb-0">数据加载异常，请重启 start.bat 后刷新页面（Ctrl+F5）</p>`;
        return;
    }

    panel.innerHTML = `
        <div class="heatmap-day-head">
            <h3 class="heatmap-day-title">${label}</h3>
            <span class="heatmap-day-count">${items.length} 条记录</span>
        </div>
        <ul class="heatmap-day-list">
            ${items.map(a => `
                <li class="heatmap-day-item" onclick="openDetail(${a.problemId})">
                    <span class="heatmap-day-name">${a.leetcodeId}. ${esc(a.problemTitle)}</span>
                    <span class="badge badge-${a.attemptType === 'FIRST' ? 'first' : 'review'}">${TYPE_LABEL[a.attemptType]}</span>
                    <span class="badge ${a.result === 'AC' ? 'bg-success' : 'bg-secondary'}">${a.result}</span>
                    ${a.mood === 'STUCK' ? '<span class="badge badge-stuck">卡顿</span>' : ''}
                    <span class="text-muted small">第 ${a.attemptNo} 次</span>
                </li>
            `).join('')}
        </ul>`;
}

function heatLevel(count) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
}

function parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

let heatmapTooltipEl = null;
function showHeatmapTooltip(e) {
    const cell = e.currentTarget;
    if (!heatmapTooltipEl) {
        heatmapTooltipEl = document.createElement('div');
        heatmapTooltipEl.className = 'heatmap-tooltip';
        document.body.appendChild(heatmapTooltipEl);
    }
    const count = +cell.dataset.count;
    heatmapTooltipEl.textContent = count
        ? `${cell.dataset.date} · ${count} 道题`
        : `${cell.dataset.date} · 无刷题`;
    heatmapTooltipEl.style.display = 'block';
    const rect = cell.getBoundingClientRect();
    heatmapTooltipEl.style.left = rect.left + rect.width / 2 + 'px';
    heatmapTooltipEl.style.top = rect.top - 8 + 'px';
}

function hideHeatmapTooltip() {
    if (heatmapTooltipEl) heatmapTooltipEl.style.display = 'none';
}

async function loadCategories() {
    const cats = await api('/problems/categories');
    const sel = document.getElementById('filter-category');
    const cur = sel.value;
    sel.innerHTML = '<option value="">全部分类</option>' +
        cats.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.value = cur;
}

function onProblemSortClick(e) {
    const btn = e.target.closest('.sortable-th[data-sort]');
    if (!btn) return;
    const field = btn.dataset.sort;
    if (problemSort.field === field) {
        problemSort.asc = !problemSort.asc;
    } else {
        problemSort = { field, asc: true };
    }
    updateProblemSortIndicators();
    renderProblemList();
}

function compareMyDifficulty(a, b, asc) {
    const da = a.myDifficulty || 0;
    const db = b.myDifficulty || 0;
    const aUnrated = da === 0;
    const bUnrated = db === 0;
    if (aUnrated && bUnrated) return 0;
    if (aUnrated) return 1;
    if (bUnrated) return -1;
    return asc ? da - db : db - da;
}

function compareOfficialDifficulty(a, b, asc) {
    const da = OFFICIAL_DIFF_RANK[a.officialDifficulty] || 0;
    const db = OFFICIAL_DIFF_RANK[b.officialDifficulty] || 0;
    return asc ? da - db : db - da;
}

function compareLastAttemptDate(a, b, asc) {
    const da = a.lastAttemptDate || '';
    const db = b.lastAttemptDate || '';
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return asc ? da.localeCompare(db) : db.localeCompare(da);
}

function compareProblems(a, b) {
    const { field, asc } = problemSort;
    let cmp = 0;
    switch (field) {
        case 'leetcodeId':
            cmp = asc ? a.leetcodeId - b.leetcodeId : b.leetcodeId - a.leetcodeId;
            break;
        case 'officialDifficulty':
            cmp = compareOfficialDifficulty(a, b, asc);
            break;
        case 'myDifficulty':
            cmp = compareMyDifficulty(a, b, asc);
            break;
        case 'attemptCount':
            cmp = asc ? a.attemptCount - b.attemptCount : b.attemptCount - a.attemptCount;
            break;
        case 'lastAttemptDate':
            cmp = compareLastAttemptDate(a, b, asc);
            break;
        default:
            cmp = a.leetcodeId - b.leetcodeId;
    }
    if (cmp !== 0) return cmp;
    return a.leetcodeId - b.leetcodeId;
}

function sortProblems(list) {
    return [...list].sort(compareProblems);
}

function updateProblemSortIndicators() {
    document.querySelectorAll('.sortable-th[data-sort]').forEach(btn => {
        const indicator = btn.querySelector('.sort-indicator');
        if (!indicator) return;
        const active = btn.dataset.sort === problemSort.field;
        btn.classList.toggle('sort-active', active);
        btn.classList.toggle('sort-idle', !active);
        indicator.classList.toggle('muted', !active);
        indicator.textContent = active
            ? (problemSort.asc ? '↑' : '↓')
            : '↕';
        btn.title = active
            ? `当前按${sortFieldLabel(btn.dataset.sort)}${problemSort.asc ? '升序' : '降序'}，点击切换方向`
            : `点击按${sortFieldLabel(btn.dataset.sort)}排序`;
    });
}

function sortFieldLabel(field) {
    return {
        leetcodeId: '题号',
        officialDifficulty: '官方难度',
        myDifficulty: '自评',
        attemptCount: '刷题次数',
        lastAttemptDate: '最近刷题日期'
    }[field] || field;
}

function renderProblemList() {
    const list = sortProblems(cachedProblemList);
    document.getElementById('problem-list-count').textContent =
        list.length ? `共 ${list.length} 题` : '';
    const empty = '<p class="text-muted mb-0 problem-list-empty">暂无题目</p>';
    document.getElementById('problem-grid').innerHTML = list.length
        ? list.map(renderProblemRow).join('')
        : empty;
    document.getElementById('problem-cards').innerHTML = list.length
        ? list.map(renderProblemCard).join('')
        : empty;
}

async function loadProblems() {
    const params = new URLSearchParams();
    const kw = document.getElementById('filter-keyword').value.trim();
    const cat = document.getElementById('filter-category').value;
    const st = document.getElementById('filter-status').value;
    if (kw) params.set('keyword', kw);
    if (cat) params.set('category', cat);
    if (st) params.set('status', st);

    cachedProblemList = await api('/problems?' + params);
    updateProblemSortIndicators();
    renderProblemList();
}

function renderProblemRow(p) {
    const diff = p.officialDifficulty ? p.officialDifficulty.toLowerCase() : 'medium';
    return `<div class="problem-row">
        <span class="pr-col pr-id">${p.leetcodeId}</span>
        <span class="pr-col pr-title" onclick="openDetail(${p.id})" title="${esc(p.title)}">
            ${esc(p.title)}${p.custom ? ' <span class="badge badge-custom">自定义</span>' : ''}
        </span>
        <span class="pr-col pr-cat">${esc(p.category)}</span>
        <span class="pr-col pr-diff diff-${diff}">${diffLabel(p.officialDifficulty)}</span>
        <span class="pr-col pr-status">${STATUS_LABEL[p.status]}</span>
        <span class="pr-col pr-stars">${stars(p.myDifficulty)}</span>
        <span class="pr-col pr-num">${p.solutionCount}</span>
        <span class="pr-col pr-num">${p.attemptCount}${p.attemptCount ? attemptBadge(p) : ''}</span>
        <span class="pr-col pr-date">${p.lastAttemptDate || '-'}</span>
        <span class="pr-col pr-actions">
            <div class="pr-btn-group">
                <a href="${esc(p.url)}" target="_blank" class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation()">LC</a>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="openDetail(${p.id})">详情</button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteProblem(${p.id})">删除</button>
            </div>
        </span>
    </div>`;
}

function renderProblemCard(p) {
    const diff = p.officialDifficulty ? p.officialDifficulty.toLowerCase() : 'medium';
    return `<article class="problem-card">
        <div class="problem-card-body" onclick="openDetail(${p.id})">
            <span class="problem-card-id">${p.leetcodeId}</span>
            <div class="problem-card-info">
                <div class="problem-card-title-row">
                    <h3 class="problem-card-title">${esc(p.title)}</h3>
                    ${p.custom ? '<span class="badge badge-custom">自定义</span>' : ''}
                </div>
                <div class="problem-card-sub">
                    <div class="problem-card-chips">
                        <span class="problem-chip">${esc(p.category)}</span>
                        <span class="problem-chip diff-${diff}">${diffLabel(p.officialDifficulty)}</span>
                        <span class="problem-chip muted">${STATUS_LABEL[p.status]}</span>
                        ${p.attemptCount ? attemptBadge(p) : ''}
                    </div>
                    <div class="problem-card-metrics">
                        <span class="problem-metric">${stars(p.myDifficulty)}</span>
                        <span class="problem-metric">${p.solutionCount} 解法</span>
                        <span class="problem-metric">${p.attemptCount} 次</span>
                        <span class="problem-metric">${p.lastAttemptDate || '未刷'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="problem-card-actions">
            <a href="${esc(p.url)}" target="_blank" class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation()">LeetCode</a>
            <button class="btn btn-sm btn-outline-primary" onclick="openDetail(${p.id})">详情</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProblem(${p.id})">删除</button>
        </div>
    </article>`;
}

function attemptBadge(p) {
    return p.attemptCount > 1 ? ' <span class="badge badge-review">复习</span>' : ' <span class="badge badge-first">首刷</span>';
}

function stars(n) {
    if (!n) return '—';
    return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderStarPicker(problemId, value) {
    const v = value || 0;
    return `<div class="star-picker" id="detail-star-picker" data-value="${v}">
        ${[1, 2, 3, 4, 5].map(i =>
            `<button type="button" class="star-btn ${i <= v ? 'on' : ''}"
                onclick="setProblemDifficulty(${problemId}, ${i})" title="${i} 星">★</button>`
        ).join('')}
        <span class="star-picker-hint">${v ? v + ' 星' : '点击设置难度'}</span>
    </div>`;
}

async function openDetail(id, { replace = false } = {}) {
    await navigateTo('detail', { id, replace });
}

async function renderDetail(id) {
    currentProblemId = id;
    const p = await api('/problems/' + id);

    document.getElementById('detail-content').innerHTML = `
        <div class="card mb-3 detail-hero-card">
            <div class="card-body">
                <div class="detail-hero-top">
                    <div class="detail-hero-main">
                        <div class="detail-star-row">
                            ${renderStarPicker(p.id, p.myDifficulty)}
                        </div>
                        <h4 class="detail-title">${p.leetcodeId}. ${esc(p.title)}
                            <a href="${p.url}" target="_blank" class="btn btn-sm btn-link">LeetCode ↗</a>
                            ${p.custom ? '<span class="badge badge-custom ms-1">自定义</span>' : '<span class="badge bg-secondary ms-1">Hot100</span>'}
                        </h4>
                        <div class="detail-meta-tags">
                            <span class="badge bg-secondary">${esc(p.category)}</span>
                            <span class="diff-${p.officialDifficulty.toLowerCase()} ms-1">${DIFF_LABEL[p.officialDifficulty]}</span>
                        </div>
                    </div>
                    <select class="form-select form-select-sm detail-status-select" id="detail-status" onchange="updateStatus(${p.id})">
                        ${Object.entries(STATUS_LABEL).map(([k,v]) => `<option value="${k}" ${p.status===k?'selected':''}>${v}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>

        <div class="detail-sections">
            <section class="detail-section detail-section-attempts">
                <div class="detail-section-head">
                    <h5>刷题历史 (${p.attempts.length})</h5>
                    <button type="button" class="btn btn-success detail-action-btn" onclick="openAttemptModal(${p.id})">+ 刷题记录</button>
                </div>
                ${p.attempts.length ? p.attempts.map(renderAttempt).join('') : '<p class="text-muted">暂无记录，点击上方按钮添加</p>'}
            </section>
            <section class="detail-section detail-section-solutions">
                <div class="detail-section-head">
                    <h5>解法 (${p.solutions.length})</h5>
                    <button type="button" class="btn btn-accent detail-action-btn" onclick="openSolutionModal(${p.id})">+ 添加解法</button>
                </div>
                ${p.solutions.length ? `<div class="solution-accordion">${p.solutions.map(renderSolution).join('')}</div>` : '<p class="text-muted">暂无解法，点击上方按钮添加</p>'}
            </section>
        </div>`;
}

function renderSolution(s) {
    const complexity = [s.timeComplexity, s.spaceComplexity].filter(Boolean).join(' / ');
    return `<div class="solution-card ${s.isPrimary ? 'primary' : ''}" data-solution-id="${s.id}">
        <div class="solution-header" onclick="toggleSolutionCard(${s.id})">
            <span class="solution-chevron" aria-hidden="true">▶</span>
            <div class="solution-summary">
                <div class="solution-title-row">
                    <strong>${esc(s.name)}</strong>
                    ${s.isPrimary ? '<span class="badge bg-warning text-dark">主解法</span>' : ''}
                </div>
                ${complexity ? `<div class="solution-complexity">${esc(complexity)}</div>` : ''}
            </div>
            <div class="solution-actions" onclick="event.stopPropagation()">
                <button class="btn btn-sm btn-outline-primary" onclick="openEditSolutionModal(${currentProblemId}, ${s.id})">编辑</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSolution(${currentProblemId}, ${s.id})">删除</button>
            </div>
        </div>
        <div class="solution-body">
            ${s.approach ? `<p class="solution-approach">${esc(s.approach).replace(/\n/g, '<br>')}</p>` : ''}
            ${s.codeSnippet ? renderCodeBlock(s.codeSnippet, `code-${s.id}`) : '<p class="text-muted mb-0">暂无代码片段</p>'}
        </div>
    </div>`;
}

function toggleSolutionCard(id) {
    const card = document.querySelector(`.solution-card[data-solution-id="${id}"]`);
    if (!card) return;
    const willExpand = !card.classList.contains('expanded');
    document.querySelectorAll('.solution-card').forEach(c => c.classList.remove('expanded'));
    if (willExpand) card.classList.add('expanded');
}

function renderCodeBlock(code, blockId) {
    const lines = code.split('\n').length;
    const lineHeightPx = 13 * 1.45;
    const padding = 20;
    const autoHeight = Math.ceil(lines * lineHeightPx + padding);
    const height = Math.min(Math.max(autoHeight, 180), 720);
    return `<div class="code-block-wrap">
        <div class="code-block-toolbar">
            <span class="code-block-meta">${lines} 行</span>
            <button type="button" class="btn btn-sm btn-link code-block-copy" onclick="copyCodeBlock('${blockId}', this)">复制</button>
        </div>
        <pre class="code-block" id="${blockId}" style="height:${height}px">${esc(code)}</pre>
    </div>`;
}

async function copyCodeBlock(id, btn) {
    const pre = document.getElementById(id);
    if (!pre) return;
    try {
        await navigator.clipboard.writeText(pre.textContent);
        const orig = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(() => { btn.textContent = orig; }, 1500);
    } catch {
        alert('复制失败，请手动选择代码复制');
    }
}

function renderAttempt(a) {
    const metaParts = [
        a.attemptDate,
        a.result,
        MOOD_LABEL[a.mood],
        a.durationMinutes != null ? `${a.durationMinutes} 分钟` : null
    ].filter(Boolean);
    return `<div class="attempt-card type-${a.attemptType} mood-${a.mood}">
        <div class="attempt-card-top">
            <div class="attempt-card-title">
                <strong>第 ${a.attemptNo} 次</strong>
                <span class="badge badge-${a.attemptType === 'FIRST' ? 'first' : 'review'}">${TYPE_LABEL[a.attemptType]}</span>
                ${a.mood === 'STUCK' ? '<span class="badge badge-stuck">卡顿</span>' : ''}
            </div>
            <div class="attempt-card-actions">
                <button class="btn btn-sm btn-link p-0" onclick="openEditAttemptModal(${currentProblemId}, ${a.id})">编辑</button>
                <button class="btn btn-sm btn-link text-danger p-0" onclick="deleteAttempt(${a.id})">删除</button>
            </div>
        </div>
        <div class="attempt-card-meta">${metaParts.join(' · ')}</div>
        ${a.solutionUsedName ? `<div class="small">解法：${esc(a.solutionUsedName)}</div>` : ''}
        ${a.notes ? `<p class="mb-0 mt-1">${esc(a.notes).replace(/\n/g, '<br>')}</p>` : ''}
    </div>`;
}

async function updateStatus(id) {
    const status = document.getElementById('detail-status').value;
    await api('/problems/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
}

async function setProblemDifficulty(id, val) {
    const picker = document.getElementById('detail-star-picker');
    const current = picker ? +picker.dataset.value : 0;
    const newVal = current === val ? 0 : val;
    await api('/problems/' + id, { method: 'PATCH', body: JSON.stringify({ myDifficulty: newVal }) });
    if (picker) {
        picker.dataset.value = newVal;
        picker.querySelectorAll('.star-btn').forEach((btn, idx) => {
            btn.classList.toggle('on', idx + 1 <= newVal);
        });
        const hint = picker.querySelector('.star-picker-hint');
        if (hint) hint.textContent = newVal ? `${newVal} 星` : '点击设置难度';
    }
}

async function openAttemptModal(problemId, options = {}) {
    if (!options.keepReturnFlag) {
        returnToDashboardAfterAttempt = false;
    }
    document.getElementById('attempt-id').value = '';
    document.getElementById('attempt-modal-title').textContent = '新增刷题记录';
    document.getElementById('attempt-problem-id').value = problemId;
    document.getElementById('attempt-date').value = todayStr();
    document.getElementById('attempt-type').value = 'FIRST';
    document.getElementById('attempt-result').value = 'AC';
    document.getElementById('attempt-mood').value = 'NORMAL';
    document.getElementById('attempt-duration').value = '';
    document.getElementById('attempt-notes').value = '';

    const solutions = await api('/problems/' + problemId + '/solutions');
    const sel = document.getElementById('attempt-solution');
    sel.innerHTML = '<option value="">（可选）</option>' +
        solutions.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');

    const detail = await api('/problems/' + problemId);
    document.getElementById('attempt-type').value =
        detail.attempts.length > 0 ? 'REVIEW' : 'FIRST';

    attemptModal.show();
}

async function openEditAttemptModal(problemId, attemptId) {
    try {
        returnToDashboardAfterAttempt = false;
        const detail = await api('/problems/' + problemId);
        const a = detail.attempts.find(x => x.id === attemptId || x.id === +attemptId);
        if (!a) { alert('记录不存在'); return; }

        document.getElementById('attempt-id').value = a.id;
        document.getElementById('attempt-modal-title').textContent = `编辑刷题记录 · 第 ${a.attemptNo} 次`;
        document.getElementById('attempt-problem-id').value = problemId;
        document.getElementById('attempt-date').value = a.attemptDate;
        document.getElementById('attempt-type').value = a.attemptType;
        document.getElementById('attempt-result').value = a.result;
        document.getElementById('attempt-mood').value = a.mood;
        document.getElementById('attempt-duration').value = a.durationMinutes ?? '';
        document.getElementById('attempt-notes').value = a.notes || '';

        const solutions = await api('/problems/' + problemId + '/solutions');
        const sel = document.getElementById('attempt-solution');
        sel.innerHTML = '<option value="">（可选）</option>' +
            solutions.map(s => `<option value="${s.id}" ${s.id === a.solutionUsedId ? 'selected' : ''}>${esc(s.name)}</option>`).join('');

        if (!attemptModal) {
            alert('弹窗组件未初始化，请刷新页面后重试');
            return;
        }
        attemptModal.show();
    } catch (e) {
        alert('打开编辑失败：' + (e.message || e));
    }
}

function openSolutionModal(problemId) {
    document.getElementById('solution-id').value = '';
    document.getElementById('solution-modal-title').textContent = '添加解法';
    document.getElementById('solution-problem-id').value = problemId;
    document.getElementById('solution-form').reset();
    document.getElementById('solution-primary').checked = false;
    solutionModal.show();
}

async function openEditSolutionModal(problemId, solutionId) {
    const detail = await api('/problems/' + problemId);
    const s = detail.solutions.find(x => x.id === solutionId);
    if (!s) { alert('解法不存在'); return; }

    document.getElementById('solution-id').value = s.id;
    document.getElementById('solution-modal-title').textContent = '编辑解法';
    document.getElementById('solution-problem-id').value = problemId;
    document.getElementById('solution-name').value = s.name;
    document.getElementById('solution-time').value = s.timeComplexity || '';
    document.getElementById('solution-space').value = s.spaceComplexity || '';
    document.getElementById('solution-approach').value = s.approach || '';
    document.getElementById('solution-code').value = s.codeSnippet || '';
    document.getElementById('solution-primary').checked = !!s.isPrimary;
    solutionModal.show();
}

async function saveAttempt() {
    try {
        const problemId = document.getElementById('attempt-problem-id').value;
        const attemptId = document.getElementById('attempt-id').value;
        const solId = document.getElementById('attempt-solution').value;
        const body = {
            attemptType: document.getElementById('attempt-type').value,
            attemptDate: document.getElementById('attempt-date').value,
            result: document.getElementById('attempt-result').value,
            mood: document.getElementById('attempt-mood').value,
            notes: document.getElementById('attempt-notes').value || null,
            durationMinutes: document.getElementById('attempt-duration').value
                ? +document.getElementById('attempt-duration').value : null,
            solutionUsedId: solId ? +solId : null
        };

        if (attemptId) {
            await api('/attempts/' + attemptId, { method: 'PUT', body: JSON.stringify(body) });
        } else {
            await api('/problems/' + problemId + '/attempts', { method: 'POST', body: JSON.stringify(body) });
        }
        attemptModal.hide();
        if (returnToDashboardAfterAttempt) {
            returnToDashboardAfterAttempt = false;
            await navigateTo('dashboard', { replace: true });
        } else {
            await openDetail(+problemId, { replace: true });
        }
    } catch (e) {
        alert('保存刷题记录失败：' + (e.message || e));
    }
}

async function saveSolution() {
    const problemId = document.getElementById('solution-problem-id').value;
    const solutionId = document.getElementById('solution-id').value;
    const body = {
        name: document.getElementById('solution-name').value,
        approach: document.getElementById('solution-approach').value,
        timeComplexity: document.getElementById('solution-time').value,
        spaceComplexity: document.getElementById('solution-space').value,
        codeSnippet: document.getElementById('solution-code').value,
        isPrimary: document.getElementById('solution-primary').checked
    };
    if (solutionId) {
        await api('/problems/' + problemId + '/solutions/' + solutionId, { method: 'PUT', body: JSON.stringify(body) });
    } else {
        await api('/problems/' + problemId + '/solutions', { method: 'POST', body: JSON.stringify(body) });
    }
    solutionModal.hide();
    await openDetail(+problemId, { replace: true });
}

async function deleteAttempt(id) {
    if (!confirm('删除这条刷题记录？')) return;
    await api('/attempts/' + id, { method: 'DELETE' });
    await openDetail(currentProblemId, { replace: true });
}

async function deleteSolution(problemId, solutionId) {
    if (!confirm('删除这个解法？')) return;
    await api('/problems/' + problemId + '/solutions/' + solutionId, { method: 'DELETE' });
    await openDetail(problemId, { replace: true });
}

async function deleteProblem(id) {
    const p = await api('/problems/' + id);
    const tag = p.custom ? '自定义' : 'Hot100';
    if (!confirm(`确定删除「${p.leetcodeId}. ${p.title}」（${tag}）？\n将同时删除所有刷题记录和解法，不可恢复。`)) return;
    await api('/problems/' + id, { method: 'DELETE' });
    if (currentProblemId === id) {
        await navigateTo('problems');
    }
    loadProblems();
}

async function openProblemModal() {
    document.getElementById('problem-form').reset();
    document.getElementById('problem-difficulty').value = 'MEDIUM';
    document.getElementById('problem-category').value = '其他';
    const cats = await api('/problems/categories');
    document.getElementById('category-suggestions').innerHTML =
        cats.map(c => `<option value="${esc(c)}">`).join('');
    problemModal.show();
}

async function saveProblem() {
    const leetcodeId = document.getElementById('problem-leetcode-id').value;
    const title = document.getElementById('problem-title').value.trim();
    const category = document.getElementById('problem-category').value.trim();
    if (!leetcodeId || !title || !category) {
        alert('请填写题号、标题和分类');
        return;
    }
    const url = document.getElementById('problem-url').value.trim();
    const body = {
        leetcodeId: +leetcodeId,
        title,
        officialDifficulty: document.getElementById('problem-difficulty').value,
        category,
        url: url || null
    };
    try {
        const created = await api('/problems', { method: 'POST', body: JSON.stringify(body) });
        problemModal.hide();
        openDetail(created.id);
    } catch (e) {
        alert(e.message);
    }
}

async function importExcel() {
    const fileInput = document.getElementById('excel-file');
    if (!fileInput.files.length) { alert('请选择 xlsx 文件'); return; }
    const fd = new FormData();
    fd.append('file', fileInput.files[0]);
    const res = await fetch(API + '/import/excel', { method: 'POST', body: fd });
    const data = await res.json();
    document.getElementById('import-result').textContent =
        `导入 ${data.imported} 条，跳过 ${data.skipped} 条` +
        (data.errors?.length ? '；错误：' + data.errors.join('; ') : '');
    loadDashboard();
}

function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

window.openDetail = openDetail;
window.openAttemptModal = openAttemptModal;
window.openEditAttemptModal = openEditAttemptModal;
window.deleteProblem = deleteProblem;
window.quickReview = quickReview;
window.openSolutionModal = openSolutionModal;
window.openEditSolutionModal = openEditSolutionModal;
window.openProblemsByCategory = openProblemsByCategory;
window.setComplexity = setComplexity;
window.copyCodeBlock = copyCodeBlock;
window.toggleSolutionCard = toggleSolutionCard;
window.updateStatus = updateStatus;
window.setProblemDifficulty = setProblemDifficulty;
window.deleteAttempt = deleteAttempt;
window.deleteSolution = deleteSolution;
