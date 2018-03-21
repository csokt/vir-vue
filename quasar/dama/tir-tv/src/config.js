import yaml from 'js-yaml'
const configYaml = `

views:
-
  id:         aktualishetigyartasiterv_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét
  device:     tv
  refresh:    70
  where:
  order:      Cikkszám
  head_after: 40
  limit:      20
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
  - name:     IT szám
    label:    IT
  - name:     Kiszállítás dátuma
    label:    Kiszáll. dátum
  - name:     Megnevezés
  - name:     Sürgős
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
  id:         kovetkezohetigyartasiterv_tv
  database:   SzefoModulKeszlet
  name:       monitor_kovetkezohetigyartasiterv
  label:      Gyártási terv - következő hét
  device:     tv
  refresh:    70
  where:
  order:      Cikkszám
  head_after: 40
  limit:      20
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
  - name:     IT szám
    label:    IT
  - name:     Kiszállítás dátuma
    label:    Kiszáll. dátum
  - name:     Megnevezés
  - name:     Sürgős
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
  id:         aktualishetigyartasiterv_osszes_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét - összes
  device:     tv
  refresh:    70
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
  id:         varrodaleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedvarrodaleadas
  label:      Szeged varroda napi leadás
  device:     tv
  refresh:    70
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
  id:         kotodeleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedkotodeleadas
  label:      Szeged kötöde napi leadás
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
  id:         elovasaloleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedelovasaloleadas
  label:      Szeged elővasaló napi leadás
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
  id:         utovasaloleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedutovasaloleadas
  label:      Szeged utóvasaló napi leadás
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
  id:         kotodeleadasszinszerint_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedkotodeleadasszinszerint
  label:      Szeged kötöde napi leadás szín szerint
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
  - name:     Szín
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
  id:         elovasaloleadasszinszerint_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedelovasaloleadasszinszerint
  label:      Szeged elővasaló napi leadás szín szerint
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
  - name:     Szín
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
  id:         szabaszatleadasszinszerint_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedszabaszatleadasszinszerint
  label:      Szeged szabászat napi leadás szín szerint
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
  - name:     Szín
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
  id:         utovasaloleadasszinszerint_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedutovasaloleadasszinszerint
  label:      Szeged utóvasaló napi leadás szín szerint
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
  - name:     Szín
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

playlists:
-
  id:         varroda
  label:      Varroda
  views:
  - id:       aktualishetigyartasiterv_tv
    interval: 60
  - id:       kovetkezohetigyartasiterv_tv
    interval: 60
  - id:       varrodaleadas_tv
    interval: 60

-
  id:         playlist2
  label:      Második lejátszási lista
  views:
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
