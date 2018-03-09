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
  - Tervezett db
  - Leadott db
  - Eltérés a tervtől
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
  - name:     Hátralék
    label:    Gyártandó
  - name:     Tervezett db
    label:    Mai terv
  - name:     Leadott db
    label:    Ma leadott
  - name:     Eltérés a tervtől
    label:    Eltérés
    positive: red
    zero:     green
    negative: green
  - name:     Hibák száma

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
  - name:     Hátralék
    label:    Gyártandó
  - name:     Leadott db
    label:    Ma leadott
  - name:     Hibák száma

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
  - Tervezett db
  - Leadott db
  - Eltérés a tervtől
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
  - name:     Hátralék
    label:    Gyártandó
  - name:     Tervezett db
    label:    Mai terv
  - name:     Leadott db
    label:    Ma leadott
  - name:     Eltérés a tervtől
    label:    Eltérés
    positive: red
    zero:     green
    negative: green
  - name:     Hibák száma

-
  id:         aktualishetigyartasiterv_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét
  device:     tv
  refresh:    300
  where:
  order:      Rendelésszám
  head_after: 40
  limit:      20
  fields:
  - name:     Cikkszám
  - name:     IT szám
  - name:     Kiszállítás dátuma
  - name:     Megnevezés
  - name:     Sürgős
  - name:     Gyártandó mennyiség
  - name:     Gyártásra vár
  - name:     Átnéző
  - name:     Mosoda
  - name:     Fércelő
  - name:     Félkész vasaló
  - name:     Szabászat
  - name:     Logisztika
  - name:     Hímző/Szitanyomó
    label:    Hímző / Szitanyomó
  - name:     Szeged varroda
  - name:     Orosháza varroda
  - name:     Hódmezővásárhely Petőfi u
    label:    Hmvhely Petőfi u

-
  id:         aktualishetigyartasiterv_osszes_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét - összes
  device:     tv
  refresh:    300
  where:
  order:      Rendelésszám
  head_after: 40
  limit:      20
  fields:
  - name:     Cikkszám
  - name:     Rendelésszám
  - name:     Partner rendelésszám
  - name:     Ütem
  - name:     Kiszállítás dátuma
  - name:     IT szám
  - name:     Megnevezés
  - name:     Finomság
  - name:     Modellszám
  - name:     Cikktípus
  - name:     Sürgős
  - name:     Rendelt mennyiség
  - name:     Szín
  - name:     Gyártandó mennyiség
  - name:     Telephely
  - name:     Fonalhiány
  - name:     Rontott
  - name:     Gyártásra vár
  - name:     Átnéző
  - name:     Mosoda
  - name:     Fércelő
  - name:     Félkész vasaló
  - name:     Szabászat
  - name:     Logisztika
  - name:     Hímző/Szitanyomó
  - name:     Szeged varroda
  - name:     Orosháza varroda
  - name:     Külső gyártók
  - name:     Kiskunhalas varroda
  - name:     Hódmezővásárhely Bocskai u
  - name:     Hódmezővásárhely Petőfi u
  - name:     Olaszország
  - name:     Készáru vasaló
  - name:     Meo
  - name:     Kivezetve
  - name:     Kiszállítva

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
  - name:     IT
  - name:     Cikkszám
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
