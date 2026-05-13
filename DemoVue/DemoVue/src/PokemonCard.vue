<template>
  <div class="panel">

    <div class="panel-header">
      <span class="panel-title">POKÉMON</span>
      <span class="badge">#{{ pokemon.id || '???' }}</span>
    </div>

    <!-- Buscador -->
    <div class="field">
      <label>Nombre o número</label>
      <div class="input-row">
        <input
          type="text"
          v-model="busqueda"
          placeholder="Ej. pikachu"
          @keyup.enter="buscarPokemon"
        />
        <button class="btn-buscar" @click="buscarPokemon">→</button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error">
      ✕ Pokémon no encontrado
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="empty-state">
      Buscando...
    </div>

    <!-- Resultado -->
    <div v-if="pokemon.nombre && !cargando" class="perfil">
      <img :src="pokemon.imagen" :alt="pokemon.nombre" class="pokemon-img" />

      <div class="pokemon-nombre">{{ pokemon.nombre }}</div>

      <div class="tipos">
        <span
          v-for="tipo in pokemon.tipos"
          :key="tipo"
          class="tipo-badge"
          :class="tipo"
        >
          {{ tipo }}
        </span>
      </div>

      <div class="stats">
        <div class="stat-fila" v-for="stat in pokemon.stats" :key="stat.nombre">
          <span class="stat-nombre">{{ stat.nombre }}</span>
          <div class="stat-barra-wrap">
            <div class="stat-barra" :style="{ width: (stat.valor / 255 * 100) + '%' }"></div>
          </div>
          <span class="stat-valor">{{ stat.valor }}</span>
        </div>
      </div>
    </div>

    <!-- Estado inicial -->
    <div v-if="!pokemon.nombre && !cargando && !error" class="empty-state">
      Busca un Pokémon para verlo aquí
    </div>

  </div>
</template>

<script>
export default {
  name: 'PokemonCard',

  data() {
    return {
      busqueda: '',
      cargando: false,
      error: false,
      pokemon: {
        id: null,
        nombre: '',
        imagen: '',
        tipos: [],
        stats: [],
      },
    }
  },

  methods: {
    async buscarPokemon() {
      const query = this.busqueda.trim().toLowerCase()
      if (!query) return

      this.cargando = true
      this.error = false
      this.pokemon = { id: null, nombre: '', imagen: '', tipos: [], stats: [] }

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        if (!res.ok) throw new Error('No encontrado')

        const data = await res.json()

        this.pokemon = {
          id: data.id,
          nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          imagen: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          tipos: data.types.map(t => t.type.name),
          stats: data.stats.map(s => ({
            nombre: s.stat.name.replace('special-', 'sp. '),
            valor: s.base_stat,
          })),
        }
      } catch {
        this.error = true
      } finally {
        this.cargando = false
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

.panel {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  padding: 2rem;
  width: 300px;
  position: relative;
  overflow: hidden;
  font-family: 'DM Mono', monospace;
  color: #f0f0f5;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: #e8ff47;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: #5a5a72;
}

.badge {
  font-size: 0.7rem;
  color: #5a5a72;
  background: #1e1e2e;
  padding: 2px 8px;
  border-radius: 2px;
}

/* Campo de búsqueda */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.field label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #5a5a72;
  text-transform: uppercase;
}

.input-row {
  display: flex;
  gap: 0.4rem;
}

.input-row input {
  flex: 1;
  background: #0d0d14;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  font-size: 0.82rem;
  padding: 0.6rem 0.75rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-row input:focus { border-color: #e8ff47; }

.btn-buscar {
  background: #e8ff47;
  border: none;
  border-radius: 2px;
  color: #0a0a0f;
  font-family: 'DM Mono', monospace;
  font-size: 1rem;
  padding: 0 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-buscar:hover { background: #d4ea30; }
.btn-buscar:active { transform: scale(0.97); }

/* Estados */
.empty-state {
  text-align: center;
  color: #5a5a72;
  font-size: 0.75rem;
  padding: 2rem 0;
  line-height: 2;
}

.error {
  font-size: 0.72rem;
  color: #ff4757;
  background: #1e0a0a;
  border: 1px solid #2e1a1a;
  border-radius: 2px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
}

/* Pokémon */
.perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.pokemon-img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  image-rendering: auto;
}

.pokemon-nombre {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.3rem;
  color: #f0f0f5;
}

/* Tipos */
.tipos { display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: center; }

.tipo-badge {
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: 500;
  background: #1e1e2e;
  color: #f0f0f5;
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

/* Stats */
.stats { width: 100%; display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.25rem; }

.stat-fila {
  display: grid;
  grid-template-columns: 4.5rem 1fr 2rem;
  align-items: center;
  gap: 0.5rem;
}

.stat-nombre {
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  color: #5a5a72;
  text-transform: uppercase;
  text-align: right;
}

.stat-barra-wrap {
  background: #1e1e2e;
  border-radius: 2px;
  height: 4px;
  overflow: hidden;
}

.stat-barra {
  height: 100%;
  background: #e8ff47;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.stat-valor {
  font-size: 0.68rem;
  color: #f0f0f5;
  text-align: right;
}
</style>