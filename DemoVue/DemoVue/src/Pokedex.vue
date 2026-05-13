<template>
  <div class="dex">

    <!-- Header -->
    <div class="dex-header">
      <div class="dex-title">POKÉ<span>DEX</span></div>
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar pokémon..."
        class="search-input"
      />
    </div>

    <!-- Filtro por tipo -->
    <div class="tipo-filter">
      <button
        v-for="tipo in tipos"
        :key="tipo"
        class="tipo-btn"
        :class="[tipo, { active: tipoActivo === tipo }]"
        @click="filtrarTipo(tipo)"
      >
        {{ tipo }}
      </button>
    </div>

    <!-- Status -->
    <div class="status-bar">{{ pokemonesFiltrados.length }} pokémon encontrados</div>

    <!-- Grid de tarjetas -->
    <div class="grid">
      <PokemonMiniCard
        v-for="pokemon in pokemonesFiltrados"
        :key="pokemon.id"
        :pokemon="pokemon"
      />
    </div>

    <!-- Cargando skeletons -->
    <div class="grid" v-if="cargando">
      <div class="skeleton-card" v-for="n in 20" :key="'sk' + n"></div>
    </div>

    <!-- Botón cargar más -->
    <button
      v-if="!cargando && offset < 898"
      class="btn-mas"
      @click="cargarMas"
      :disabled="cargandoMas"
    >
      {{ cargandoMas ? 'Cargando...' : 'CARGAR MÁS →' }}
    </button>

  </div>
</template>

<script>
import PokemonMiniCard from './PokemonMiniCard.vue'

export default {
  name: 'Pokedex',
  components: { PokemonMiniCard },

  data() {
    return {
      pokemon: [],
      busqueda: '',
      tipoActivo: null,
      cargando: false,
      cargandoMas: false,
      offset: 0,
      tipos: [
        'fire','water','grass','electric','psychic','ice',
        'dragon','dark','fairy','normal','fighting','flying',
        'poison','ground','rock','bug','ghost','steel',
      ],
    }
  },

  computed: {
    pokemonesFiltrados() {
      const q = this.busqueda.toLowerCase().trim()
      return this.pokemon.filter(p => {
        const matchNombre = p.name.includes(q) || String(p.id).includes(q)
        const matchTipo = !this.tipoActivo || p.types.includes(this.tipoActivo)
        return matchNombre && matchTipo
      })
    },
  },

  methods: {
    async fetchPokemon(id) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const d = await res.json()
      return {
        id: d.id,
        name: d.name,
        img: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
        types: d.types.map(t => t.type.name),
      }
    },

    async cargarMas() {
      this.cargandoMas = true
      const ids = Array.from({ length: 40 }, (_, i) => this.offset + i + 1)
      this.offset += 40
      const nuevos = await Promise.all(ids.map(id => this.fetchPokemon(id)))
      this.pokemon = [...this.pokemon, ...nuevos]
      this.cargandoMas = false
    },

    filtrarTipo(tipo) {
      this.tipoActivo = this.tipoActivo === tipo ? null : tipo
    },
  },

  async created() {
    this.cargando = true
    const ids = Array.from({ length: 40 }, (_, i) => i + 1)
    this.offset = 40
    this.pokemon = await Promise.all(ids.map(id => this.fetchPokemon(id)))
    this.cargando = false
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

.dex {
  background: #0a0a0f;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'DM Mono', monospace;
}

.dex-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.dex-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  color: #f0f0f5;
}

.dex-title span { color: #e8ff47; }

.search-input {
  background: #0d0d14;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  font-size: 0.82rem;
  padding: 0.6rem 1rem;
  outline: none;
  width: 220px;
  transition: border-color 0.2s;
}

.search-input:focus { border-color: #e8ff47; }

/* Filtros de tipo */
.tipo-filter {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.tipo-btn {
  font-family: 'DM Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 2px;
  border: 1px solid #1e1e2e;
  background: transparent;
  color: #5a5a72;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s;
}

.tipo-btn.active,
.tipo-btn:hover { opacity: 1; }

.tipo-btn.fire.active    { background: #2e1a0a; border-color: #ff8c42; color: #ff8c42; }
.tipo-btn.water.active   { background: #0a1a2e; border-color: #42b4ff; color: #42b4ff; }
.tipo-btn.grass.active   { background: #0a2e1a; border-color: #42ff8c; color: #42ff8c; }
.tipo-btn.electric.active{ background: #2a2e0a; border-color: #e8ff47; color: #e8ff47; }
.tipo-btn.psychic.active { background: #2e0a1a; border-color: #ff4299; color: #ff4299; }
.tipo-btn.ice.active     { background: #0a2a2e; border-color: #42e8ff; color: #42e8ff; }
.tipo-btn.dragon.active  { background: #0a0a2e; border-color: #7747ff; color: #7747ff; }
.tipo-btn.dark.active    { background: #1a1a1a; border-color: #888780; color: #888780; }
.tipo-btn.fairy.active   { background: #2e0a2a; border-color: #ff47e8; color: #ff47e8; }
.tipo-btn.normal.active  { background: #1e1e2e; border-color: #b4b2a9; color: #b4b2a9; }
.tipo-btn.fighting.active{ background: #2e0a0a; border-color: #ff4742; color: #ff4742; }
.tipo-btn.flying.active  { background: #1a1a2e; border-color: #85b7eb; color: #85b7eb; }
.tipo-btn.poison.active  { background: #1e0a2e; border-color: #b447ff; color: #b447ff; }
.tipo-btn.ground.active  { background: #2e1e0a; border-color: #d4a042; color: #d4a042; }
.tipo-btn.rock.active    { background: #1a1a0a; border-color: #888042; color: #888042; }
.tipo-btn.bug.active     { background: #0a1a0a; border-color: #42c842; color: #42c842; }
.tipo-btn.ghost.active   { background: #0a0a1e; border-color: #7a47b4; color: #7a47b4; }
.tipo-btn.steel.active   { background: #1a1a1e; border-color: #9999aa; color: #9999aa; }

.status-bar {
  font-size: 0.65rem;
  color: #5a5a72;
  margin-bottom: 1rem;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Skeletons */
.skeleton-card {
  height: 180px;
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  animation: pulse 1.2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.8; }
}

/* Botón cargar más */
.btn-mas {
  width: 100%;
  background: transparent;
  border: 1px dashed #1e1e2e;
  border-radius: 2px;
  color: #5a5a72;
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  padding: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 0.5rem;
}

.btn-mas:hover:not(:disabled) { border-color: #e8ff47; color: #e8ff47; }
.btn-mas:disabled { opacity: 0.5; cursor: not-allowed; }
</style>