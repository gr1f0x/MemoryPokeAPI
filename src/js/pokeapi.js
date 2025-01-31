const MAX_POKEMON_ID = 150;

export function getRandomPokemonIds(totalPairs) {
  if (!Number.isInteger(totalPairs) || totalPairs <= 0) {
    throw new Error('Total pairs must be a positive integer');
  }

  const ids = new Set();
  while (ids.size < totalPairs) {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    ids.add(id);
  }
  return Array.from(ids);
}

export function getPokemonImageUrl(id) {
  if (!id || !Number.isInteger(Number(id))) {
    throw new Error('Invalid Pokemon ID');
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
