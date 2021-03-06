import { dom } from 'quasar'

const viewport = dom.viewport()
const device = Math.max(viewport.height, viewport.width) < 800 ? 'phone' : 'tablet'
const facingMode = device === 'phone' ? 'environment' : 'user'

let Store = {
  version: '18.08.08',
  teszt: false,
  privateIP: '',
  publicIP: '',
  device: device,
  video: {
    facingMode: facingMode,
    width: 320,
    height: 240
  },
  user: null,
  kodol: null,
  views: [],
  kodolasok: [],
  atadasok: [],
  kezdIdo: new Date(new Date().toJSON().slice(0, 10) + 'T05:30:00'),
  menthet: true
}

export default Store
