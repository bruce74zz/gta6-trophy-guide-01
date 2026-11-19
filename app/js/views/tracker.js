// Renders the checklist rows: checkbox, official name/description/grade, kind and flags.
import { kindLabel, gradeLabel } from '../data.js';
import { isMasked, maskedName, maskedDescription } from '../filters.js';

export function renderTrophyList(listEl, trophies, state, earned, selectedId, onSelect, onToggle) {
  listEl.replaceChildren();
  if (trophies.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-list';
    li.textContent = 'No trophies match these filters.';
    listEl.append(li);
    return;
  }
  for (const t of trophies) {
    const masked = isMasked(t, state, earned);
    const li = document.createElement('li');
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'trophy-item' + (earned[t.name] ? ' earned' : '') + (t.id === selectedId ? ' selected' : '');
    item.addEventListener('click', () => onSelect(t.id));

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = Boolean(earned[t.name]);
    box.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : t.name} as earned`);
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      onToggle(t.name, box.checked);
    });

    const body = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = (earned[t.name] ? '✓ ' : '') + (masked ? maskedName() : t.name);
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = masked ? maskedDescription() : t.description;
    const meta = document.createElement('span');
    meta.className = 'trophy-meta';
    const gradeChip = document.createElement('span');
    gradeChip.className = 'chip ' + t.grade;
    gradeChip.textContent = gradeLabel(t.grade);
    meta.append(gradeChip);
    const kindChip = document.createElement('span');
    kindChip.className = 'chip kind';
    kindChip.textContent = kindLabel(t.kind);
    meta.append(kindChip);
    if (t.hidden) {
      const hiddenChip = document.createElement('span');
      hiddenChip.className = 'chip hidden';
      hiddenChip.textContent = 'Hidden';
      meta.append(hiddenChip);
    }
    if (t.missable) {
      const missChip = document.createElement('span');
      missChip.className = 'chip missable';
      missChip.textContent = 'Missable';
      meta.append(missChip);
    }
    if (t.count != null) {
      const countChip = document.createElement('span');
      countChip.className = 'chip';
      countChip.textContent = '×' + t.count;
      meta.append(countChip);
    }
    body.append(name, document.createElement('br'), desc, meta);

    const right = document.createElement('span');
    right.className = 'trophy-meta';
    const stageChip = document.createElement('span');
    stageChip.className = 'chip';
    stageChip.textContent = 'Stage ' + t.stage;
    right.append(stageChip);

    item.append(box, body, right);
    li.append(item);
    listEl.append(li);
  }
}

export function renderProgress(progressText, progressPct, progressFill, progressBarWrap, gradeCounts, trophies, earned) {
  const total = trophies.length;
  const done = trophies.filter((t) => earned[t.name]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressText.textContent = `${done} of ${total} earned`;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
  progressBarWrap.setAttribute('aria-valuenow', String(done));
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { done: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (earned[t.name]) byGrade[t.grade].done += 1;
  }
  gradeCounts.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${gradeLabel(g)} ${byGrade[g].done}/${byGrade[g].total}`)
    .join(' · ');
}
