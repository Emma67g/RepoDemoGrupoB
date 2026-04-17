import "./PokemonCard.css";

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null;

  const mainType = pokemon.types?.[0]?.type.name;
  const bgColor = typeColors[mainType] || "#777";

  const image =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  return (
    <div className="card" style={{ "--type-color": bgColor }}>
      <div className="card-inner">
        <div className="card-header">
          <h2>{pokemon.name}</h2>
          <span>HP {pokemon?.stats?.[0]?.base_stat}</span>
        </div>

        <div className="card-image">
          {image && <img src={image} alt={pokemon.name} />}
        </div>

        <div className="card-body">
          <p>
            <strong>Tipo:</strong>{" "}
            {pokemon.types?.map(t => t.type.name).join(", ")}
          </p>
          <p><strong>Altura:</strong> {pokemon.height}</p>
          <p><strong>Peso:</strong> {pokemon.weight}</p>
        </div>

        <div className="card-footer">
          ⚡ Ataque: {pokemon?.stats?.[1]?.base_stat}
        </div>

        {/* ✨ capa holográfica */}
        <div className="holo"></div>
      </div>
    </div>
  );
};

export default PokemonCard;