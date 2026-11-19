// Renders the detail panel for one trophy: official text, guide, steps, sources.
import { kindLabel, gradeLabel } from '../data.js';
import { isMasked, maskedName, maskedDescription } from '../filters.js';

export function renderDetail(detailEl, trophy, sourcesMap, state, earned, onToggle) {
  detailEl.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'detail-empty';
    p.textContent = 'Select a trophy to read its guide, steps and sources.';
    detailEl.append(p);
    return;
  }
  const masked = isMasked(trophy, state, earned);
  const title = document.createElement('h2');
  title.textContent = masked ? maskedName() : trophy.name;
  detailEl.append(title);

  const meta = document.createElement('p');
  meta.className = 'trophy-meta';
  const gradeChip = document.createElement('span');
  gradeChip.className = 'chip ' + trophy.grade;
  gradeChip.textContent = gradeLabel(trophy.grade);
  meta.append(gradeChip);
  const kindChip = document.createElement('span');
  kindChip.className = 'chip kind';
  kindChip.textContent = kindLabel(trophy.kind);
  meta.append(kindChip);
  if (trophy.hidden) {
    const c = document.createElement('span');
    c.className = 'chip hidden';
    c.textContent = 'Hidden on PSN';
    meta.append(c);
  }
  if (trophy.missable) {
    const c = document.createElement('span');
    c.className = 'chip missable';
    c.textContent = 'Missable';
    meta.append(c);
  }
  detailEl.append(meta);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = masked
    ? maskedDescription()
    : `Official description: “${trophy.description}”`;
  detailEl.append(official);

  if (masked) {
    const maskNote = document.createElement('p');
    maskNote.className = 'spoiler-mask';
    maskNote.textContent = 'Spoilers are hidden. Earn this trophy in the game — or turn “Hide story spoilers” off — to read its guide.';
    detailEl.append(maskNote);
  } else {
    if (trophy.missable && trophy.missableNote) {
      const note = document.createElement('p');
      note.className = 'missable-note';
      note.textContent = 'Missable: ' + trophy.missableNote;
      detailEl.append(note);
    }
    if (trophy.saveWatch) {
      const note = document.createElement('p');
      note.className = 'verified-note';
      note.textContent = 'Save-watch: keep a manual save around this one — there is no mission replay.';
      detailEl.append(note);
    }
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'Guide';
    detailEl.append(guideHead);
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    detailEl.append(guide);

    if (trophy.steps && trophy.steps.length) {
      const stepsHead = document.createElement('h3');
      stepsHead.textContent = 'Steps';
      detailEl.append(stepsHead);
      const steps = document.createElement('ol');
      for (const step of trophy.steps) {
        const li = document.createElement('li');
        li.textContent = step;
        steps.append(li);
      }
      detailEl.append(steps);
    }

    if (trophy.count != null) {
      const count = document.createElement('p');
      count.className = 'official';
      count.textContent = `Tracked count: ${trophy.count}.`;
      detailEl.append(count);
    }

    const srcHead = document.createElement('h3');
    srcHead.textContent = 'Sources';
    detailEl.append(srcHead);
    const srcList = document.createElement('ul');
    srcList.className = 'sources';
    for (const key of trophy.sources || []) {
      const src = sourcesMap[key];
      const li = document.createElement('li');
      if (src) {
        const a = document.createElement('a');
        a.href = src.url;
        a.textContent = src.label;
        a.target = '_blank';
        a.rel = 'noopener';
        li.append(a);
      } else {
        li.textContent = key;
      }
      srcList.append(li);
    }
    detailEl.append(srcList);
  }

  const toggleWrap = document.createElement('div');
  toggleWrap.className = 'earned-toggle';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.textContent = earned[trophy.name] ? '✓ Earned — mark as not earned' : 'Mark as earned';
  if (earned[trophy.name]) toggle.classList.add('earned');
  toggle.addEventListener('click', () => onToggle(trophy.name, !earned[trophy.name]));
  toggleWrap.append(toggle);
  detailEl.append(toggleWrap);
}
