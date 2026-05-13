<template>
  <div class="contador-wrapper">
    <!-- Header -->
    <div class="header">
      <span class="label">CONTADOR</span>
      <span class="version">v1.0</span>
    </div>

    <!-- Pantalla del contador -->
    <div class="display" :class="{ positive: contador > 0, negative: contador < 0, zero: contador === 0 }">
      <div class="display-inner">
        <span class="signo">{{ contador > 0 ? '+' : contador < 0 ? '' : '±' }}</span>
        <span class="numero" :key="contador">{{ contador }}</span>
      </div>
      <div class="estado">
        <span class="dot" :class="{ active: contador !== 0 }"></span>
        {{ estadoTexto }}
      </div>
    </div>

    <!-- Botones -->
    <div class="controles">
      <button
        class="btn btn-dec"
        @click="decrementar"
        @mousedown="presionado = 'dec'"
        @mouseup="presionado = null"
        @mouseleave="presionado = null"
        :class="{ pressed: presionado === 'dec' }"
        aria-label="Decrementar"
      >
        <span class="btn-icon">−</span>
        <span class="btn-text">DECREMENTAR</span>
      </button>

      <button
        class="btn btn-reset"
        @click="reiniciar"
        aria-label="Reiniciar"
        title="Reiniciar a cero"
      >
        <span class="btn-icon reset-icon">↺</span>
      </button>

      <button
        class="btn btn-inc"
        @click="incrementar"
        @mousedown="presionado = 'inc'"
        @mouseup="presionado = null"
        @mouseleave="presionado = null"
        :class="{ pressed: presionado === 'inc' }"
        aria-label="Incrementar"
      >
        <span class="btn-icon">+</span>
        <span class="btn-text">INCREMENTAR</span>
      </button>
    </div>

    <!-- Historial -->
    <div class="historial">
      <span class="historial-label">HISTORIAL</span>
      <div class="historial-lista">
        <span
          v-for="(h, i) in historialReciente"
          :key="i"
          class="historial-item"
          :class="{ positivo: h > 0, negativo: h < 0 }"
        >
          {{ h > 0 ? '+' + h : h }}
        </span>
        <span v-if="historial.length === 0" class="historial-vacio">sin cambios</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contador',

  data() {
    return {
      contador: 0,
      historial: [],
      presionado: null,
    }
  },

  computed: {
    estadoTexto() {
      if (this.contador === 0) return 'en cero'
      if (this.contador > 0) return 'positivo'
      return 'negativo'
    },
    historialReciente() {
      return this.historial.slice(-6).reverse()
    },
  },

  methods: {
    incrementar() {
      this.contador++
      this.historial.push(this.contador)
    },
    decrementar() {
      this.contador--
      this.historial.push(this.contador)
    },
    reiniciar() {
      this.contador = 0
      this.historial = []
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

.contador-wrapper {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  padding: 2.5rem 2.5rem 2rem;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  font-family: 'DM Mono', monospace;
}

.contador-wrapper::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: #e8ff47;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #5a5a72;
}
.version {
  font-size: 0.7rem;
  color: #5a5a72;
  background: #1e1e2e;
  padding: 2px 8px;
  border-radius: 2px;
}

/* Pantalla */
.display {
  background: #0a0a0f;
  border: 1px solid #1e1e2e;
  border-radius: 2px;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.3s ease;
}
.display.positive { border-color: #2a2e1a; }
.display.negative { border-color: #2e1a1a; }

.display-inner {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.1em;
}
.signo {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #5a5a72;
  line-height: 1;
}
.numero {
  font-family: 'Syne', sans-serif;
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #f0f0f5;
  animation: aparecer 0.15s ease;
}
.display.positive .numero { color: #e8ff47; }
.display.negative .numero { color: #ff4757; }

@keyframes aparecer {
  from { transform: translateY(-6px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.estado {
  margin-top: 0.75rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #5a5a72;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #5a5a72;
  transition: background 0.3s;
}
.dot.active {
  background: #e8ff47;
  box-shadow: 0 0 8px #e8ff47;
}

/* Controles */
.controles {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: stretch;
}
.btn {
  border: 1px solid #1e1e2e;
  background: transparent;
  color: #f0f0f5;
  font-family: 'DM Mono', monospace;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 0.5rem;
}
.btn-icon { font-size: 1.6rem; font-weight: 300; line-height: 1; }
.btn-text { font-size: 0.6rem; letter-spacing: 0.12em; color: #5a5a72; }

.btn-inc { border-color: #2a2e1a; }
.btn-inc:hover { background: #e8ff47; border-color: #e8ff47; color: #0a0a0f; }
.btn-inc:hover .btn-text { color: #0a0a0f; }
.btn-inc.pressed { transform: scale(0.97); background: #b8cc30; }

.btn-dec { border-color: #2e1a1a; }
.btn-dec:hover { background: #ff4757; border-color: #ff4757; color: #fff; }
.btn-dec:hover .btn-text { color: rgba(255,255,255,0.7); }
.btn-dec.pressed { transform: scale(0.97); background: #cc3344; }

.btn-reset { width: 48px; padding: 0; }
.reset-icon { font-size: 1.1rem; color: #5a5a72; }
.btn-reset:hover { border-color: #5a5a72; background: #1e1e2e; }

/* Historial */
.historial {
  border-top: 1px solid #1e1e2e;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.historial-label { font-size: 0.65rem; letter-spacing: 0.18em; color: #5a5a72; }
.historial-lista { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.historial-item {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 2px;
  background: #1e1e2e;
  color: #5a5a72;
}
.historial-item.positivo { color: #e8ff47; background: #1a1e0a; }
.historial-item.negativo { color: #ff4757; background: #1e0a0a; }
.historial-vacio { font-size: 0.7rem; color: #5a5a72; font-style: italic; }
</style>