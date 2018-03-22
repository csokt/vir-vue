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
#  tablefontsize:  14px
#  headfontsize:   10px
#  bodyfontsize:   10px
  fields:
  - name:     Dolgozó kód
    type:     number
    filter:   egyenlő
    default:  belepokod
    readonly: true
  - name:     Cikkszám
    label:    Cikk
    filter:   egyenlő
    search:   filterCikkszam
#    fontsize: 24px
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
    label:    Cikk
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
    label:    Cikk
    filter:   egyenlő
    default:  filterCikkszam
    search:   filterCikkszam
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
  where:
  order:      Cikkszám
  head_after: 15
  limit:      100
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Tervezett db
  - Leadott db
  - Eltérés a tervtől
  - Hibák száma
  - Hátralék
  fields:
  - name:     Cikkszám
    label:    Cikk
    search:   filterCikkszam
  - name:     IT
  - name:     Megnevezés
  - name:     Megrendelő
  - name:     Rendelt db
    label:    Rendelt
  - name:     Előzőleg leadott db
    label:    Előzőleg leadott
  - name:     Hátralék
    label:    Gyártandó
    positive: red
    zero:     green
    negative: green
  - name:     Tervezett db
    label:    Mai terv
  - name:     Leadott db
    label:    Ma leadott
  - name:     Eltérés a tervtől
    label:    Eltérés
    positive: green
    zero:     green
    negative: red
  - name:     Hibák száma
    label:    Hibák

-
  id:         aktualishetigyartasiterv_tablet
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét
  device:     tablet
  roles:
  - varró
  - varrodavezető
  where:
  order:      Cikkszám
  head_after: 15
  limit:      100
  sum:
  - Gyártandó mennyiség
  - Gyártásra vár
  - Átnéző
  - Mosoda
  - Fércelő
  - Félkész vasaló
  - Szabászat
  - Logisztika
  - Hímző/Szitanyomó
  - Szeged varroda
  - Orosháza varroda
  - Hódmezővásárhely Petőfi u
  fields:
  - name:     Cikkszám
    label:    Cikk
    search:   filterCikkszam
  - name:     IT szám
    label:    IT
  - name:     Kiszállítás dátuma
    label:    Kiszáll. dátum
    fontsize: 14px
  - name:     Megnevezés
    fontsize: 14px
  - name:     Sürgős
    fontsize: 14px
  - name:     Gyártandó mennyiség
    label:    Gyárt. menny.
  - name:     Gyártásra vár
    label:    Gyárt. vár
  - name:     Átnéző
    label:    Átn.
  - name:     Mosoda
    label:    Mos.
  - name:     Fércelő
    label:    Férc.
  - name:     Félkész vasaló
    label:    Félk. vas.
  - name:     Szabászat
    label:    Szab.
  - name:     Logisztika
    label:    Log.
  - name:     Hímző/Szitanyomó
    label:    Hímző
  - name:     Szeged varroda
    label:    Szeged varr.
  - name:     Orosháza varroda
    label:    Orosh. varr.
  - name:     Hódmezővásárhely Petőfi u
    label:    Hmvh. varr.

-
  id:         kovetkezohetigyartasiterv_tablet
  database:   SzefoModulKeszlet
  name:       monitor_kovetkezohetigyartasiterv
  label:      Gyártási terv - következő hét
  device:     tablet
  roles:
  - varró
  - varrodavezető
  where:
  order:      Cikkszám
  head_after: 15
  limit:      100
  sum:
  - Gyártandó mennyiség
  - Gyártásra vár
  - Átnéző
  - Mosoda
  - Fércelő
  - Félkész vasaló
  - Szabászat
  - Logisztika
  - Hímző/Szitanyomó
  - Szeged varroda
  - Orosháza varroda
  - Hódmezővásárhely Petőfi u
  fields:
  - name:     Cikkszám
    label:    Cikk
    search:   filterCikkszam
  - name:     IT szám
    label:    IT
  - name:     Kiszállítás dátuma
    label:    Kiszáll. dátum
    fontsize: 14px
  - name:     Megnevezés
    fontsize: 14px
  - name:     Sürgős
    fontsize: 14px
  - name:     Gyártandó mennyiség
    label:    Gyárt. menny.
  - name:     Gyártásra vár
    label:    Gyárt. vár
  - name:     Átnéző
    label:    Átn.
  - name:     Mosoda
    label:    Mos.
  - name:     Fércelő
    label:    Férc.
  - name:     Félkész vasaló
    label:    Félk. vas.
  - name:     Szabászat
    label:    Szab.
  - name:     Logisztika
    label:    Log.
  - name:     Hímző/Szitanyomó
    label:    Hímző
  - name:     Szeged varroda
    label:    Szeged varr.
  - name:     Orosháza varroda
    label:    Orosh. varr.
  - name:     Hódmezővásárhely Petőfi u
    label:    Hmvh. varr.

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
    label:    Cikk
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
    label:    Cikk
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
