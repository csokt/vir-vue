import { dom } from 'quasar'
const viewport = dom.viewport()
const device = Math.max(viewport.height, viewport.width) < 800 ? 'phone' : 'tablet'
const facingMode = device === 'phone' ? 'environment' : 'user'

let Store = {
  teszt: null,
  device: device,
  video: {
    facingMode: facingMode,
    width: 320,
    height: 240
  },
  user: null,
  kodol: null,
  kodolasok: [],
  menthet: true
}

export default Store
