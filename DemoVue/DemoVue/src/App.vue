<template>
  <div>
    <!-- Fila de componentes pequeños -->
    <div class="fila">
      <Contador />
      <FormularioUsuario />
      <PokemonCard />
    </div>

    <!-- Pokédex a pantalla completa -->
    <Pokedex />
  </div>
</template>

<script>
import Contador from './Contador.vue'
import FormularioUsuario from './FormularioUsuario.vue'
import PokemonCard from './PokemonCard.vue'
import Pokedex from './Pokedex.vue'

export default {
  components: { Contador, FormularioUsuario, PokemonCard, Pokedex }
}
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #0a0a0f;
  min-height: 100vh;
}

.fila {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem 2rem 0;
}
</style>