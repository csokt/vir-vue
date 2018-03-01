import yaml from 'js-yaml'
const configYaml = `

views:
-
  id:         varrodaleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedvarrodaleadas
  label:      Szeged varroda napi leadás
  device:     tv
  refresh:    300
  where:
  order:      '[Cikk/IT]'
  head_after: 15
  limit:      20
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Leadott db
  - Hibák száma
  - Hátralék
  fields:
  - name:     Cikk/IT
  - name:     Megnevezés
  - name:     Megrendelő
  - name:     Rendelt db
    label:    Rendelt
  - name:     Előzőleg leadott db
    label:    Előzőleg leadott
  - name:     Leadott db
    label:    Ma leadott
  - name:     Hibák száma
  - name:     Hátralék
    label:    Gyártandó

-
  id:         vasaloleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedvasaloleadas
  label:      Szeged vasaló napi leadás
  device:     tv
  refresh:    300
  where:
  order:      '[Cikk/IT]'
  head_after: 40
  limit:      20
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Leadott db
  - Hibák száma
  - Hátralék
  fields:
  - name:     Cikk/IT
  - name:     Megnevezés
  - name:     Megrendelő
  - name:     Rendelt db
    label:    Rendelt
  - name:     Előzőleg leadott db
    label:    Előzőleg leadott
  - name:     Leadott db
    label:    Ma leadott
  - name:     Hibák száma
  - name:     Hátralék
    label:    Gyártandó

-
  id:         szabaszatleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedszabaszatleadas
  label:      Szeged szabászat napi leadás
  device:     tv
  refresh:    300
  where:
  order:      '[Cikk/IT]'
  head_after: 40
  limit:      20
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Leadott db
  - Hibák száma
  - Hátralék
  fields:
  - name:     Cikk/IT
  - name:     Megnevezés
  - name:     Megrendelő
  - name:     Rendelt db
    label:    Rendelt
  - name:     Előzőleg leadott db
    label:    Előzőleg leadott
  - name:     Leadott db
    label:    Ma leadott
  - name:     Hibák száma
  - name:     Hátralék
    label:    Gyártandó

-
  id:         fonalstatusz
  database:   SzefoModulKeszlet
  name:       Monitor_FonalStatuszView
  label:      SZ.J. - Fonal státusz
  device:     tv
  refresh:    300
  order:      Partiszám
  head_after: 15
  limit:      20
  fields:
  - name:     Partiszám
  - name:     Szállítólevél
  - name:     Partner rend szám
  - name:     SZEFO rend szám
  - name:     Dátum
  - name:     Termék cikkszám
  - name:     Fonal cikkszám
  - name:     Olasz megnevezés
  - name:     Magyar megnevezés
  - name:     Méret
  - name:     Szín
  - name:     Mennyiség
  - name:     Szükséglet
  - name:     Gyártási ütem

playlists:
-
  id:         playlist1
  label:      Első lejátszási lista
  views:
  - id:       varrodaleadas_tv
    interval: 5
  - id:       vasaloleadas_tv
    interval: 5
  - id:       szabaszatleadas_tv
    interval: 5
  - id:       fonalstatusz
    interval: 5

-
  id:         playlist2
  label:      Második lejátszási lista
  views:
  - id:       szabaszatleadas_tv
    interval: 30
  - id:       fonalstatusz
    interval: 30
`

let Config = null
try {
  Config = yaml.safeLoad(configYaml)
  for (let view of Config.views) {
    let schema = {}
    for (let field of view.fields) {
      if (!field.label) { field.label = field.name }
      if (!field.filter) { continue }
      schema[field.name] = {
        type: field.type === 'number' ? Number : String,
        label: (field.label || field.name) + ' ' + field.filter,
        optional: true
      }
      if (field.readonly) {
        schema[field.name].autoform = {readonly: true}
      }
    }
    // view.schema = new SimpleSchema(schema)
  }
}
catch (err) {
  console.log(err)
}

export default Config
