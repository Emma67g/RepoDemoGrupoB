<template>
  <div class="pagina">

    <!-- Formulario -->
    <div class="panel">
      <span class="panel-title">FORMULARIO</span>

      <div class="field">
        <label for="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          v-model="nombre"
          placeholder="Ej. Juan Pérez"
        />
      </div>

      <div class="field">
        <label for="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          v-model="correo"
          placeholder="Ej. juan@correo.com"
        />
      </div>

      <button class="btn-guardar" @click="guardar">GUARDAR →</button>
    </div>

    <!-- Tarjeta de perfil -->
    <div class="panel card-panel">
      <span class="panel-title">PERFIL</span>

      <div v-if="!guardado" class="empty-state">
        <p>Llena el formulario para ver tu perfil</p>
      </div>

      <div v-else class="perfil">
        <div class="avatar">{{ iniciales }}</div>
        <div class="perfil-nombre">{{ perfil.nombre }}</div>
        <div class="perfil-fila">
          <span class="perfil-icono">✉</span>
          <div>
            <div class="perfil-sub">CORREO</div>
            <div class="perfil-dato">{{ perfil.correo }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FormularioUsuario',

  data() {
    return {
      nombre: '',
      correo: '',
      guardado: false,
      perfil: {
        nombre: '',
        correo: '',
      },
    }
  },

  computed: {
    iniciales() {
      return this.perfil.nombre
        .trim()
        .split(' ')
        .map(p => p[0] || '')
        .join('')
        .substring(0, 2)
        .toUpperCase() || '?'
    },
  },

  methods: {
    guardar() {
      if (!this.nombre && !this.correo) return
      this.perfil.nombre = this.nombre
      this.perfil.correo = this.correo
      this.guardado = true
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

.pagina {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
}

.panel {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  padding: 2rem;
  width: 300px;
  position: relative;
  overflow: hidden;
  font-family: 'DM Mono', monospace;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: #e8ff47;
}

.panel-title {
  display: block;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: #5a5a72;
  margin-bottom: 1.5rem;
}

/* Campos */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.field label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #5a5a72;
  text-transform: uppercase;
}

.field input {
  background: #0d0d14;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  font-size: 0.82rem;
  padding: 0.6rem 0.75rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.field input:focus {
  border-color: #e8ff47;
}

.btn-guardar {
  width: 100%;
  background: #e8ff47;
  border: none;
  border-radius: 2px;
  color: #0a0a0f;
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  padding: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: background 0.15s;
}

.btn-guardar:hover { background: #d4ea30; }
.btn-guardar:active { transform: scale(0.98); }

/* Perfil */
.card-panel {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  color: #5a5a72;
  font-size: 0.75rem;
  line-height: 2;
  padding: 2rem 0;
}

.perfil {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e8ff47;
  color: #0a0a0f;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.perfil-nombre {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  text-align: center;
  color: #f0f0f5;
}

.perfil-fila {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-top: 1px solid #1e1e2e;
  padding-top: 0.8rem;
}

.perfil-icono { font-size: 0.85rem; color: #5a5a72; }
.perfil-sub { font-size: 0.62rem; color: #5a5a72; letter-spacing: 0.1em; }
.perfil-dato { font-size: 0.75rem; color: #f0f0f5; word-break: break-all; }
</style>