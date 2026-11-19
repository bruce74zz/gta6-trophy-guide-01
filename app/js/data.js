// Loads the trophy list and roadmap from the app's own data files (fetch of local files only).
export async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc;
}

export async function loadRoadmapData() {
  const response = await fetch('data/roadmap.json');
  if (!response.ok) throw new Error('Could not load data/roadmap.json');
  return response.json();
}

export function kindLabel(kind) {
  const labels = {
    story: 'Story',
    side: 'Side story',
    collectibles: 'Collectibles',
    activities: 'Activities',
    crime: 'Crime & robberies',
    exploration: 'Exploration',
    misc: 'Odd job',
    completion: 'Completion',
  };
  return labels[kind] || kind;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}
