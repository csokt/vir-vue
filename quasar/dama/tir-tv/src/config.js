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
  id:         varrodatermeles_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedvarrodatermeles
  label:      Szeged varroda heti gyártási terve
  device:     tv
  refresh:    300
  where:
  order:      Rendelésszám
  head_after: 40
  limit:      20
  fields:
  - name:     Rendelésszám
    type:     number
    filter:   egyenlő
  - name:     IT
    filter:   egyenlő
  - name:     Cikkszám
    filter:   egyenlő
  - name:     Megnevezés
  - name:     Model
  - name:     Szín
  - name:     Gyártandó

playlists:
-
  id:         varroda
  label:      Varroda
  views:
  - id:       varrodaleadas_tv
    interval: 60
  - id:       varrodatermeles_tv
    interval: 60

-
  id:         playlist2
  label:      Második lejátszási lista
  views:
  - id:       vasaloleadas_tv
    interval: 5
  - id:       szabaszatleadas_tv
    interval: 5
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
