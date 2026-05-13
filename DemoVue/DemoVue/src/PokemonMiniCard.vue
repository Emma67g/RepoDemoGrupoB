<template>
  <div class="card">
    <span class="num">#{{ String(pokemon.id).padStart(3, '0') }}</span>
    <img :src="pokemon.img" :alt="pokemon.name" class="img" loading="lazy" />
    <div class="nombre">{{ pokemon.name }}</div>
    <div class="tipos">
      <span
        v-for="tipo in pokemon.types"
        :key="tipo"
        class="chip"
        :class="tipo"
      >
        {{ tipo }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokemonMiniCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.card {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
  font-family: 'DM Mono', monospace;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: #1e1e2e;
  transition: background 0.2s;
}

.card:hover { border-color: #3a3a52; }
.card:hover::before { background: #e8ff47; }

.num {
  font-size: 0.6rem;
  color: #5a5a72;
  align-self: flex-end;
}

.img {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.nombre {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  text-align: center;
  color: #f0f0f5;
  text-transform: capitalize;
}

.tipos { display: flex; gap: 0.3rem; flex-wrap: wrap; justify-content: center; }

.chip {
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 2px;
  text-transform: uppercase;
}

.fire    { background: #2e1a0a; color: #ff8c42; }
.water   { background: #0a1a2e; color: #42b4ff; }
.grass   { background: #0a2e1a; color: #42ff8c; }
.electric{ background: #2a2e0a; color: #e8ff47; }
.psychic { background: #2e0a1a; color: #ff4299; }
.ice     { background: #0a2a2e; color: #42e8ff; }
.dragon  { background: #0a0a2e; color: #7747ff; }
.dark    { background: #1a1a1a; color: #888780; }
.fairy   { background: #2e0a2a; color: #ff47e8; }
.normal  { background: #1e1e2e; color: #b4b2a9; }
.fighting{ background: #2e0a0a; color: #ff4742; }
.flying  { background: #1a1a2e; color: #85b7eb; }
.poison  { background: #1e0a2e; color: #b447ff; }
.ground  { background: #2e1e0a; color: #d4a042; }
.rock    { background: #1a1a0a; color: #888042; }
.bug     { background: #0a1a0a; color: #42c842; }
.ghost   { background: #0a0a1e; color: #7a47b4; }
.steel   { background: #1a1a1e; color: #9999aa; }
</style>