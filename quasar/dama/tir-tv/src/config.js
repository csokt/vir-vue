import yaml from 'js-yaml'
const configYaml = `

views:
-
  id:         ram_logisztika_tv
  database:   SzefoModulKeszlet
  name:       monitor_ramviewtablet
  label:      Logisztika – RAM
  device:     tv
  refresh:    70
  where:      "[Kiszállítás dátuma] BETWEEN GETDATE() AND GETDATE() + 7 and [Gyártásra vár]+[Átnéző]+[Mosoda]+[Fércelő]+[Félkész vasaló]+[Szabászat]+[Logisztika]>0"
  order:      '[Cikkszám], [IT szám]'
  head_after: 100
  limit:      100
#  tablefontsize:  14px
#  headfontsize:   16px
#  bodyfontsize:   10px
  sum:
  - Gyártásra vár
  - Átnéző
  - Mosoda
  - Fércelő
  - Félkész vasaló
  - Szabászat
  - Logisztika
  fields:
  - name:     Cikkszám
    label:    Cikk
  - name:     IT szám
    label:    IT
  - name:     Modellszám
    label:    Modell
  - name:     Rendelésszám
    label:    Rend.sz.
  - name:     Megnevezés
    fontsize: 16px
  - name:     Finomság
    label:    gg
  - name:     Szín
  - name:     Rendelt mennyiség
    label:    Rend. db
  - name:     Gyártásra vár
    label:    gy.v.
  - name:     Átnéző
    label:    átn.
  - name:     Mosoda
    label:    mos.
  - name:     Fércelő
    label:    férc.
  - name:     Félkész vasaló
    label:    f.vas.
  - name:     Szabászat
    label:    szab.
  - name:     Logisztika
    label:    log.
  - name:     Ütem
  - name:     Kiszállítás dátuma
    label:    Kiszállítás
    fontsize: 16px

-
  id:         logisztikaleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedlogisztikaleadas
  label:      Logisztika – napi leadás
  device:     tv
  refresh:    70
  where:
  order:      '[Cikk/IT]'
  head_after: 100
  limit:      50
  sum:
  - Rendelt db
  - Előzőleg leadott db
  - Leadott db
  - Hátralék
  - Hibák száma
  fields:
  - name:     Cikk/IT
  - name:     Modell
  - name:     Finomság
    label:    gg
  - name:     Megnevezés
  - name:     Megrendelő
  - name:     Rendelt db
    label:    Rendelt
  - name:     Előzőleg leadott db
    label:    Előzőleg leadott
  - name:     Leadott db
    label:    Ma leadott
  - name:     Hátralék
    positive: red
    zero:     green
    negative: green
  - name:     Hibák száma
    label:    Hibák

-
  id:         aktualishetigyartasiterv_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét
  device:     tv
  refresh:    70
  where:
  order:      '[Cikkszám], [IT szám], [Szín]'
  head_after: 100
  limit:      50
#  tablefontsize:  14px
  headfontsize:   16px
#  bodyfontsize:   10px
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
  - name:     Szín
  - name:     Kiszállítás dátuma
    label:    Kiszállítás
    fontsize: 16px
  - name:     Megnevezés
    fontsize: 16px
  - name:     Sürgős
    fontsize: 16px
  - name:     Gyártandó mennyiség
    label:    Gyártandó
  - name:     Gyártásra vár
    label:    Gyárt.vár
  - name:     Átnéző
    label:    Átn.
  - name:     Mosoda
    label:    Mos.
  - name:     Fércelő
    label:    Férc.
  - name:     Félkész vasaló
    label:    Félk.vas.
  - name:     Szabászat
    label:    Szab.
  - name:     Logisztika
    label:    Log.
  - name:     Hímző/Szitanyomó
    label:    Hímző
  - name:     Szeged varroda
    label:    Szeged
  - name:     Orosháza varroda
    label:    Orosh.
  - name:     Hódmezővásárhely Petőfi u
    label:    Hmvh.

-
  id:         kovetkezohetigyartasiterv_tv
  database:   SzefoModulKeszlet
  name:       monitor_kovetkezohetigyartasiterv
  label:      Gyártási terv - következő hét
  device:     tv
  refresh:    70
  where:
  order:      '[Cikkszám], [IT szám], [Szín]'
  head_after: 100
  limit:      50
  headfontsize:   16px
#  bodyfontsize:   14px
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
  - name:     Szín
  - name:     Kiszállítás dátuma
    label:    Kiszállítás
    fontsize: 16px
  - name:     Megnevezés
    fontsize: 16px
  - name:     Sürgős
    fontsize: 16px
  - name:     Gyártandó mennyiség
    label:    Gyártandó
  - name:     Gyártásra vár
    label:    Gyárt.vár
  - name:     Átnéző
    label:    Átn.
  - name:     Mosoda
    label:    Mos.
  - name:     Fércelő
    label:    Férc.
  - name:     Félkész vasaló
    label:    Félk.vas.
  - name:     Szabászat
    label:    Szab.
  - name:     Logisztika
    label:    Log.
  - name:     Hímző/Szitanyomó
    label:    Hímző
  - name:     Szeged varroda
    label:    Szeged
  - name:     Orosháza varroda
    label:    Orosh.
  - name:     Hódmezővásárhely Petőfi u
    label:    Hmvh.

-
  id:         aktualishetigyartasiterv_osszes_tv
  database:   SzefoModulKeszlet
  name:       monitor_aktualishetigyartasiterv
  label:      Gyártási terv - aktuális hét - összes
  device:     tv
  refresh:    70
  where:
  order:      Rendelésszám
  head_after: 100
  limit:      50
  fontsize:   14px
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
  head_after: 100
  limit:      50
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
  id:         oroshazavarrodaleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_oroshazavarrodaleadas
  label:      Orosháza varroda napi leadás
  device:     tv
  refresh:    70
  where:
  order:      '[Cikk/IT]'
  head_after: 100
  limit:      50
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
  id:         sarretudvarivarrodaleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_sarretudvarivarrodaleadas
  label:      Sárrétudvari varroda napi leadás
  device:     tv
  refresh:    70
  where:
  order:      '[Cikk/IT]'
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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
  id:         utovasaloleadas_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedutovasaloleadas
  label:      Szeged utóvasaló napi leadás
  device:     tv
  refresh:    300
  where:
  order:      '[Cikk/IT]'
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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
  head_after: 100
  limit:      50
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

-
  id:         utovasaloleadasszinszerint_tv
  database:   SzefoModulKeszlet
  name:       monitor_szegedutovasaloleadasszinszerint
  label:      Szeged utóvasaló napi leadás szín szerint
  device:     tv
  refresh:    300
  where:
  order:      '[Cikk/IT]'
  head_after: 100
  limit:      50
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
  id:         szabaszat
  label:      Szabászat
  views:
  - id:       aktualishetigyartasiterv_tv
    interval: 60
  - id:       kovetkezohetigyartasiterv_tv
    interval: 60
  - id:       szabaszatleadasszinszerint_tv
    interval: 60

-
  id:         logisztika
  label:      Logisztika
  views:
  - id:       ram_logisztika_tv
    interval: 60
  - id:       logisztikaleadas_tv
    interval: 60
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
