import { dom } from 'quasar'
const url = new URL(window.location.href)
const teszt = url.searchParams.get('teszt') !== null

const viewport = dom.viewport()
const device = Math.max(viewport.height, viewport.width) < 800 ? 'phone' : 'tablet'
const facingMode = device === 'phone' ? 'environment' : 'user'

let Store = {
  version: '18.11.10',
  teszt: teszt,
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
  kodolasok: [],
  atadasok: [],
  kezdIdo: new Date(new Date().toJSON().slice(0, 10) + 'T05:30:00'),
  menthet: true
}

export default Store
