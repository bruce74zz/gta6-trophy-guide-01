// Leonida Trophy Guide — bootstrap: loads data, wires the tabs, filters, tracker and views.
// URL parameters (for deep links and screenshots): ?view=tracker|roadmap|missables|sources
//   ?spoiler=on|off  ?grade=bronze|silver|gold|platinum  ?kind=story|activities|...  ?trophy=<id>
import { loadTrophyData, loadRoadmapData } from './data.js';
import { loadProgress, saveProgress, loadSettings, saveSettings, exportProgressFile, parseImportedProgress } from './store.js';
import { applyFilters } from './filters.js';
import { renderTrophyList, renderProgress } from './views/tracker.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';

const params = new URLSearchParams(location.search);
const doc = await loadTrophyData();
const roadmap = await loadRoadmapData();
const trophies = doc.trophies;
const sourcesMap = doc.sources || {};

const savedSettings = loadSettings();
const state = {
  view: params.get('view') || 'tracker',
  kind: params.get('kind') || 'all',
  grade: params.get('grade') || 'all',
  query: '',
  missableOnly: false,
  earnedOnly: false,
  hideEarned: false,
  spoiler: params.get('spoiler') ? params.get('spoiler') === 'on' : (savedSettings.spoiler !== false),
  selectedId: params.get('trophy') ? Number(params.get('trophy')) : null,
};
let earned = loadProgress();

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detail');

function persistSettings() {
  saveSettings({ spoiler: state.spoiler });
}

function renderAll() {
  const filtered = applyFilters(trophies, state, earned);
  renderTrophyList(listEl, filtered, state, earned, state.selectedId,
    (id) => { state.selectedId = id; renderAll(); },
    (name, checked) => { toggleEarned(name, checked); });
  renderProgress($('progressText'), $('progressPct'), $('progressFill'), $('progressBarWrap'), $('gradeCounts'), trophies, earned);
  const selected = trophies.find((t) => t.id === state.selectedId) || null;
  renderDetail(detailEl, selected, sourcesMap, state, earned,
    (name, checked) => { toggleEarned(name, checked); });
  $('listHint').textContent = `Showing ${filtered.length} of ${trophies.length} trophies` +
    (state.spoiler ? ' · story spoilers hidden for trophies you have not earned yet' : ' · spoilers shown');
}

function toggleEarned(name, checked) {
  if (checked) earned[name] = true;
  else delete earned[name];
  saveProgress(earned);
  renderAll();
  renderRoadmapView();
}

function showView(view) {
  state.view = view;
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active', section.id === 'view-' + view);
  });
  if (view === 'roadmap') renderRoadmapView();
  if (view === 'missables') renderMissablesView();
  if (view === 'sources') renderSourcesView();
}

function renderRoadmapView() {
  renderRoadmap($('roadmapBody'), roadmap, trophies, earned, (id) => {
    state.selectedId = id;
    showView('tracker');
    renderAll();
  });
}

function renderMissablesView() {
  renderMissables($('missablesBody'), trophies, (id) => {
    state.selectedId = id;
    showView('tracker');
    renderAll();
  });
}

function renderSourcesView() {
  const body = $('sourcesBody');
  body.replaceChildren();
  const card = document.createElement('div');
  card.className = 'source-list';
  const h2 = document.createElement('h2');
  h2.textContent = 'Sources and how this guide was made';
  card.append(h2);
  const p1 = document.createElement('p');
  p1.textContent = 'Trophy names, descriptions and grades are the official PlayStation list, as published on Exophase and cross-checked on PSNProfiles. Every guide is written for this entry in our own words — never copied from another guide — and names its sources beside it. Where a method is not yet verified in the game, the guide says so plainly instead of inventing a location or step.';
  card.append(p1);
  const list = document.createElement('ul');
  for (const key of Object.keys(sourcesMap)) {
    const src = sourcesMap[key];
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = src.url;
    a.textContent = src.label;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    list.append(li);
  }
  card.append(list);
  const p2 = document.createElement('p');
  p2.textContent = 'Counts (42 Shooting Range challenges, 14 drone race locations, 18 meditation spots, 500 Criminal Profile actions and the rest) come from the PSN tracked counts and the launch-week guides above. Hidden trophies: 28 of the 55 stay hidden on PlayStation until earned; this guide hides them too when the spoiler setting is on. There are no online trophies. The game launched 19 November 2026, so a few hidden trophies still have no confirmed method — those guides say so and will be updated as guides verify them.';
  card.append(p2);
  const p3 = document.createElement('p');
  p3.textContent = 'Progress is stored only in your browser (localStorage). Export writes a JSON file you can keep or move to another browser; import reads it back. Nothing leaves your device and the app makes no network requests.';
  card.append(p3);
  body.append(card);
}

// Tabs
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => showView(tab.dataset.view));
});

// Controls
$('search').addEventListener('input', (e) => { state.query = e.target.value; renderAll(); });
$('kind').value = state.kind;
$('kind').addEventListener('change', (e) => { state.kind = e.target.value; renderAll(); });
$('grade').value = state.grade;
$('grade').addEventListener('change', (e) => { state.grade = e.target.value; renderAll(); });
$('missableOnly').addEventListener('change', (e) => { state.missableOnly = e.target.checked; renderAll(); });
$('earnedOnly').addEventListener('change', (e) => { state.earnedOnly = e.target.checked; renderAll(); });
$('hideEarned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; renderAll(); });
$('spoiler').checked = state.spoiler;
$('spoiler').addEventListener('change', (e) => {
  state.spoiler = e.target.checked;
  persistSettings();
  renderAll();
});

// Export / import
$('exportBtn').addEventListener('click', () => {
  exportProgressFile(trophies.filter((t) => earned[t.name]).map((t) => t.name));
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    earned = parseImportedProgress(await file.text(), trophies.map((t) => t.name));
    saveProgress(earned);
    renderAll();
    renderRoadmapView();
  } catch (err) {
    alert('Could not import that file: ' + err.message);
  }
  e.target.value = '';
});

showView(['tracker', 'roadmap', 'missables', 'sources'].includes(state.view) ? state.view : 'tracker');
renderAll();
