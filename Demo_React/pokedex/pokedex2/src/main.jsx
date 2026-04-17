import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PokemonSearch from './PokemonSearch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PokemonSearch />
  </StrictMode>
)