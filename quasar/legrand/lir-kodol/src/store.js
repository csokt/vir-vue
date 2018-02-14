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
  dolgozo: null,
  gyartasi_lap_id: null,
  muveletszam: null,
  mennyiseg: null,
  gyartasi_lap: null,
  gylap_szefo_muvelet: null,
  odooConnected: false,

  kodol: null,
  kodolasok: [],
  filter: null,
  menthet: true,

  userError: ''
}

export default Store
