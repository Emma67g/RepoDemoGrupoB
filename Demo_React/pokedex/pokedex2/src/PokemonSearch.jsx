import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

const LIMIT = 20;

const PokemonSearch = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
      );
      const data = await res.json();

      const promises = data.results.map((p) =>
        fetch(p.url).then(res => res.json())
      );

      // 🔥 Manejo seguro de errores
      const results = await Promise.allSettled(promises);

      const validPokemons = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

      setPokemons(validPokemons);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "white" }}>Pokédex</h1>

      {loading && <p style={{ textAlign: "center", color: "white" }}>Cargando...</p>}

      <div style={styles.grid}>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div style={styles.buttons}>
        <button
          onClick={() => setOffset(offset - LIMIT)}
          disabled={offset === 0}
        >
          ⬅️ Anterior
        </button>

        <button onClick={() => setOffset(offset + LIMIT)}>
          Siguiente ➡️
        </button>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "40px",
    padding: "40px",
    justifyContent: "center",
    justifyItems: "center",
    alignItems: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
};

export default PokemonSearch;