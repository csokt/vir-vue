import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
  - field: torzs
    headerName: Törzsadatok
  - field: forgalom
    headerName: Forgalom
  - field: keszlet
    headerName: Készlet
  - field: logisztika
    headerName: Logisztika
  - field: kotode
    headerName: Kötöde
  - field: varroda
    headerName: Varroda
  menu:
    torzs:
    - value:  Üzemek
      path:   uzemek
    - value:  Telephelyek
      path:   telephelyek
    forgalom:
    - value:  "-"
      path:   nincs
    keszlet:
    - value:  Kellék
      path:   kellekkeszlet
    - value:  E-H-U
      path:   ehukeszlet
    logisztika:
    - value:  Napi leadás
      path:   logisztika_leadas
    kotode:
    - value:  Napi leadás
      path:   kotode_leadas
    varroda:
    - value:  Napi leadás
      path:   varroda_leadas

uzemek:
  title: Üzemek
  defaultColDef:
    filter: true
  columnDefs:
  - field: uzemkod
    headerName: Üzemkód
    filter: agNumberColumnFilter
    type: numericColumn
  - field: uzemnev
    headerName: Üzemnév
  - field: vonalkod
    headerName: Vonalkód
    type: numericColumn
  - field: telephelykod
    headerName: Telephelykód
    type: numericColumn
  - field: telephely
    headerName: Telephely
  - field: uzemtipus
    headerName: Üzemtípus
  - field: statusz
    headerName: Státusz
  mssql: SELECT uzemek.*, telephely FROM uzemek JOIN telephelyek on uzemek.telephelykod = telephelyek.telephelykod

telephelyek:
  title: Telephelyek
  columnDefs:
  - field: telephelykod
    headerName: Telephelykód
    type: numericColumn
  - field: telephely
    headerName: Telephely
  - field: minmunkakod
    headerName: Munkakód min
    type: numericColumn
  - field: maxmunkakod
    headerName: Munkakód max
    type: numericColumn
  mssql: SELECT * FROM telephelyek

kellekkeszlet:
  title: Kellék készlet
  #pivotMode: true
  sideBar: true
  defaultColDef:
    filter: true
  columnDefs:
  - field: cikkszam
    headerName: Cikk
    enableRowGroup: true
  - field: itszam
    headerName: IT
    enableRowGroup: true
  - field: partnerrendelesszam
    headerName: Rendelésszám
    enableRowGroup: true
  - field: munkalapazonosito
    headerName: Munkalap
  - field: helynev
    headerName: Hely
    enableRowGroup: true
    enablePivot: true
    pivot: true
  - field: kellektipusnev
    headerName: Kelléktípus
    enableRowGroup: true
  - field: szinkod
    headerName: Szín
    enableRowGroup: true
  - field: db
    headerName: db
    type: numericColumn
    aggFunc: sum
  - field: ugyfelnev
    headerName: Megrendelő
    enableRowGroup: true
  - field: utem
    headerName: Ütem
    enableRowGroup: true
  mssql: >-
    SELECT
      fej.cikkszam, fej.itszam, fej.partnerrendelesszam,
      ugyfel.nev AS ugyfelnev,
      helyek.rhely AS helynev,
      szotar.nev AS kellektipusnev,
      mlap.utem, mlap.szinkod, mlap.hely, mlap.munkalapazonosito, mlap.kellektipus, mlap.db
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
    WHERE mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N'
    ORDER BY mlap.rendelesszam, mlap.szinkod, mlap.hely

ehukeszlet:
  title: Termék készlet
  #pivotMode: true
  sideBar: true
  defaultColDef:
    filter: true
  columnDefs:
  - field: cikkszam
    headerName: Cikk
    enableRowGroup: true
  - field: itszam
    headerName: IT
    enableRowGroup: true
  - field: partnerrendelesszam
    headerName: Rendelésszám
    enableRowGroup: true
  - field: munkalapazonosito
    headerName: Munkalap
  - field: helynev
    headerName: Hely
    enableRowGroup: true
    enablePivot: true
    pivot: true
  - field: szinkod
    headerName: Szín
    enableRowGroup: true
  - field: meret
    headerName: Méret
    enableRowGroup: true
  - field: db
    headerName: db
    type: numericColumn
    aggFunc: sum
  - field: ugyfelnev
    headerName: Megrendelő
    enableRowGroup: true
  - field: utem
    headerName: Ütem
    enableRowGroup: true
  mssql: >-
    SELECT
      fej.cikkszam, fej.itszam, fej.partnerrendelesszam,
      ugyfel.nev AS ugyfelnev,
      helyek.rhely AS helynev,
      mlap.utem, mlap.szinkod, mlap.hely, mlap.meret, mlap.munkalapazonosito, mlap.kellektipus, mlap.db
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    WHERE mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N'
    ORDER BY mlap.rendelesszam, mlap.szinkod, mlap.hely

`

let Config = null
try {
  Config = yaml.safeLoad(configYaml)
  let arr = []
  for (const iterator of Config.kkrmenu.columnDefs) {
    const column = Config.kkrmenu.menu[iterator.field]
    arr.push(column.length)
  }
  const maxlength = Math.max(...arr)

  let menu = []
  for (let index = 0; index < maxlength; index++) {
    let row = []
    for (const iterator of Config.kkrmenu.columnDefs) {
      const column = Config.kkrmenu.menu[iterator.field]
      row.push({ field: iterator.field, ...column[index] })
    }
    menu.push(row)
  }
  Config.kkrmenu.menu = menu
} catch (err) {
  console.log(err)
}

export default Config
