import { dom } from 'quasar'
const viewport = dom.viewport()
const device = Math.max(viewport.height, viewport.width) < 800 ? 'phone' : 'tablet'
const facingMode = device === 'phone' ? 'environment' : 'user'

let Store = {
  device: device,
  video: {
    facingMode: facingMode,
    width: 320,
    height: 240
  },
  user: null,
  kodol: null,
  kodolasok: [],
  filter: null,
  menthet: true,

  userError: ''
}

export default Store
