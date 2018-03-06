import yaml from 'js-yaml'
var configYaml = `

views:
###############################################################################  Tablet  ###
-
  id:         napikodolas
  database:   SzefoModulKeszlet
  name:       monitor_napikodolas
  label:      Mai napi kódolások
  device:     tablet
  roles:
  - varró
  - varrodavezető
  refresh:    10
  order:      '[Kódolás ideje] DESC'
  head_after: 15
  limit:      100
  fields:
  - name:     Dolgozó kód
    type:     number
    filter:   egyenlő
    default:  belepokod
    readonly: true
  - name:     Cikkszám
    filter:   egyenlő
    search:   filterCikkszam
  - name:     IT
    filter:   egyenlő
  - name:     Diszpó
  - name:     Szín
  - name:     csomag
    label:    Csom.
  - name:     Méret
  - name:     darab
  - name:     Művelet
  - name:     Művelet név
  - name:     Normaperc
    label:    Norma perc
  - name:     Megjegyzés
  - name:     Kódoló
  - name:     Kódolás ideje

-
  id:         havikodolas
  database:   SzefoModulKeszlet
  name:       monitor_havikodolas
  label:      Aktuális havi kódolások
  device:     tablet
  roles:
  - varró
  - varrodavezető
  order:      '[Kódolás ideje] DESC'
  head_after: 15
  limit:      1000
  fields:
  - name:     Dolgozó kód
    type:     number
    filter:   egyenlő
    default:  belepokod
    readonly: true
  - name:     Cikkszám
    filter:   egyenlő
  - name:     IT
    filter:   egyenlő
  - name:     Diszpó
  - name:     Szín
  - name:     csomag
    label:    Csom.
  - name:     Méret
  - name:     darab
  - name:     Művelet
  - name:     Művelet név
  - name:     Normaperc
    label:    Norma perc
  - name:     Megjegyzés
  - name:     Kódoló
  - name:     Kódolás ideje

-
  id:         becsultszazalek
  database:   SzefoModulKeszlet
  name:       monitor_becsultszazalek
  label:      Becsült teljesítmények %
  device:     tablet
  roles:
  - varró
  - varrodavezető
  order:      '[Dolgozó kód]'
  head_after: 15
  limit:      100
  fields:
  - name:     Dolgozó kód
    type:     number
    filter:   egyenlő
    default:  belepokod
    readonly: true
  - name:     Napi becs %
    label:    Mai becsült %
  - name:     1 napi becs %
    label:    1 nappal ezelőtti becsült %
  - name:     2 napi becs %
    label:    2 nappal ezelőtti becsült %
  - name:     3 napi becs %
    label:    3 nappal ezelőtti becsült %
  - name:     Havi becs %
    label:    Aktuális havi becsült %
  - name:     1 havi lezárt %
    label:    Előző havi lezárt %

-
  id:         cikknormai
  database:   SzefoModulKeszlet
  name:       monitor_cikknormai
  label:      Konfekció normalapok
  device:     tablet
  roles:
  - varró
  - kódoló
  - varrodavezető
  order:      Műveletkód
  head_after: 15
  limit:      500
  fields:
  - name:     Cikkszám
    filter:   egyenlő
    default:  filterCikkszam
  - name:     Műveletkód
    type:     number
    filter:   egyenlő
  - name:     Megnevezés
  - name:     Normaperc
    label:    Norma perc
  - name:     Előkészítő
  - name:     Normatípus
  - name:     Gép

-
  id:         varrodaleadas_tablet
  database:   SzefoModulKeszlet
  name:       monitor_szegedvarrodaleadas
  label:      Szeged varroda napi leadás
  device:     tablet
  roles:
  - varró
  - varrodavezető
  order:      '[Cikk/IT]'
  head_after: 15
  limit:      100
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Leadott db
  - Hibák száma
  - Hátralék
  fields:
  - name:     Cikk/IT
    filter:   egyenlő
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
  id:         varrodatermeles
  database:   SzefoModulKeszlet
  name:       monitor_szegedvarrodatermeles
  label:      Szeged varroda heti gyártási terve
  device:     tablet
  roles:
  - varró
  - varrodavezető
  order:      Rendelésszám
  head_after: 15
  limit:      100
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

-
  id:         mitkodoltamma
  database:   SzefoModulKeszlet
  name:       monitor_napikodolas
  label:      Mit kódoltam ma?
  device:     tablet
  roles:
  - kódoló
  order:      '[Kódolás ideje] DESC'
  head_after: 15
  limit:      100
  fields:
  - name:     Kódoló kód
    type:     number
    filter:   egyenlő
    default:  belepokod
    readonly: true
  - name:     Cikkszám
    filter:   egyenlő
  - name:     IT
    filter:   egyenlő
  - name:     Diszpó
  - name:     Szín
  - name:     csomag
    label:    Csom.
  - name:     Méret
  - name:     darab
  - name:     Művelet
  - name:     Művelet név
  - name:     Normaperc
    label:    Norma perc
  - name:     Megjegyzés
  - name:     Dolgozó
  - name:     Kódolás ideje

-
  id:         muveletosszegzese
  database:   SzefoModulKeszlet
  name:       monitor_muveletekosszegzese
  label:      Bekódolt műveletek összegzése
  device:     tablet
  roles:
  - varrodavezető
  order:      Művelet
  head_after: 15
  limit:      500
  fields:
  - name:     Cikkszám
    filter:   egyenlő
  - name:     IT
    filter:   egyenlő
  - name:     Művelet
    type:     number
    filter:   egyenlő
  - name:     Megnevezés
  - name:     darab
    label:    Összes bekódolt db.


`

let Config = null
try {
  Config = yaml.safeLoad(configYaml)
  for (let view of Config.views) {
    let schema = {fields: []}
    for (let field of view.fields) {
      if (!field.label) { field.label = field.name }
      if (!field.filter) { continue }
      let schemafield = {
        type: 'input',
        inputType: field.type === 'number' ? 'number' : 'text',
        label: (field.label || field.name) + ' ' + field.filter,
        model: field.name
      }
      if (field.readonly) { schemafield.readonly = true }
      schema.fields.push(schemafield)
    }
    view.schema = schema
  }
}
catch (err) {
  console.log(err)
}

export default Config
