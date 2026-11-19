// Renders the roadmap view: the five stages to the platinum, with their trophies.
export function renderRoadmap(bodyEl, roadmap, trophies, earned, onOpenTrophy) {
  bodyEl.replaceChildren();
  const intro = document.createElement('div');
  intro.className = 'roadmap-intro';
  const h2 = document.createElement('h2');
  h2.textContent = roadmap.title || 'Road to the Platinum';
  intro.append(h2);
  const est = document.createElement('p');
  est.textContent = roadmap.estimate || '';
  intro.append(est);
  bodyEl.append(intro);

  const savePlan = document.createElement('div');
  savePlan.className = 'save-plan';
  const saveHead = document.createElement('h3');
  saveHead.textContent = 'Manual save plan (no mission replay)';
  savePlan.append(saveHead);
  const saveList = document.createElement('ul');
  for (const line of roadmap.savePlan || []) {
    const li = document.createElement('li');
    li.textContent = line;
    saveList.append(li);
  }
  savePlan.append(saveList);
  bodyEl.append(savePlan);

  for (const stage of roadmap.stages || []) {
    const card = document.createElement('div');
    card.className = 'stage';
    const head = document.createElement('h3');
    head.textContent = stage.title;
    card.append(head);
    const text = document.createElement('p');
    text.textContent = stage.text;
    card.append(text);
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    const members = trophies.filter((t) => t.stage === stage.stage);
    for (const t of members) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = (earned[t.name] ? '✓ ' : '') + t.name;
      if (earned[t.name]) b.classList.add('done');
      b.addEventListener('click', () => onOpenTrophy(t.id));
      chips.append(b);
    }
    card.append(chips);
    bodyEl.append(card);
  }
}
