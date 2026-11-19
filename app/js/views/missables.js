// Renders the missables view: the one confirmed risk, save-watch trophies, and what is safe.
export function renderMissables(bodyEl, trophies, onOpenTrophy) {
  bodyEl.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  const watch = trophies.filter((t) => t.saveWatch);

  const head = document.createElement('h2');
  head.textContent = 'Missable trophies';
  bodyEl.append(head);
  const intro = document.createElement('p');
  intro.textContent = 'Launch-week guides (PowerPyx, OutputLag, KeenGamer) agree: there is one trophy with a missable moment. Everything else stays available after the story in free roam. The save-watch list below is not missable — it is where a spare manual save is cheap insurance, because there is no mission replay.';
  bodyEl.append(intro);

  for (const t of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const h3 = document.createElement('h3');
    h3.textContent = '⚠ ' + t.name + ' — ' + t.grade;
    card.append(h3);
    const desc = document.createElement('p');
    desc.textContent = t.description;
    card.append(desc);
    const note = document.createElement('p');
    note.textContent = t.missableNote || '';
    card.append(note);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    card.append(guide);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Open its guide in the tracker';
    btn.addEventListener('click', () => onOpenTrophy(t.id));
    card.append(btn);
    bodyEl.append(card);
  }

  const watchHead = document.createElement('h3');
  watchHead.textContent = 'Save-watch (not missable, keep a save anyway)';
  bodyEl.append(watchHead);
  for (const t of watch) {
    const card = document.createElement('div');
    card.className = 'watch-card';
    const h3 = document.createElement('h3');
    h3.textContent = t.name;
    card.append(h3);
    const desc = document.createElement('p');
    desc.textContent = t.description;
    card.append(desc);
    const why = document.createElement('p');
    why.textContent = t.id === 7
      ? 'The final mission cannot be replayed. Keep an untouched manual save from just before it.'
      : t.id === 25
        ? 'Yago’s Race Against Yago in Chapter 3 is time-sensitive (hourglass icon). Do it the moment it appears, or the strand may fail — though other strands can still reach 8.'
        : 'This trophy turns on story choices. Keep a save before major decision points so you can go back without replaying the game.';
    card.append(why);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Open its guide in the tracker';
    btn.addEventListener('click', () => onOpenTrophy(t.id));
    card.append(btn);
    bodyEl.append(card);
  }

  const safe = document.createElement('div');
  safe.className = 'safe-note';
  const safeHead = document.createElement('h3');
  safeHead.textContent = 'Safe after the story';
  safe.append(safeHead);
  const safeText = document.createElement('p');
  safeText.textContent = 'PowerPyx reports that all trophy-related quest givers return after the story, Strangers & Freaks stay available, and nothing on the 100% checklist is missable. Optional missions with hourglass icons can disappear, but PowerPyx notes there are far more than the 100 needed for the checklist, so a failed optional mission never locks the platinum.';
  safe.append(safeText);
  const safeText2 = document.createElement('p');
  safeText2.textContent = 'One more warning that is not a missable trophy: cheats disable trophies and saving, so keep them off your trophy save.';
  safe.append(safeText2);
  bodyEl.append(safe);
}
