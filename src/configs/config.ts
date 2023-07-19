const SERVER_URL = import.meta.env.VITE_SERVER_URL

const MAP_TILE_KEY = import.meta.env.VITE_MAP_TILE_KEY
const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY

export default {
  serverUrl: SERVER_URL,
  map: {
    tileKey: MAP_TILE_KEY,
    apiKey: MAP_API_KEY
  }
}
