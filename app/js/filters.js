// Filtering, searching and spoiler masking for the trophy list.
export function applyFilters(trophies, state, earned) {
  const query = (state.query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.missableOnly && !t.missable) return false;
    if (state.earnedOnly && !earned[t.name]) return false;
    if (state.hideEarned && earned[t.name]) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

// A hidden story trophy stays masked until the player earns it, when spoilers are on.
export function isMasked(trophy, state, earned) {
  return Boolean(state.spoiler && trophy.hidden && !earned[trophy.name]);
}

export function maskedName() {
  return 'Hidden trophy';
}

export function maskedDescription() {
  return 'Hidden on PlayStation until earned. Tick it off to reveal it.';
}
