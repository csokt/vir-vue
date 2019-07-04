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
  pivotMode: true
  sideBar: true
  columnDefs:
  - field: rendelesszam
    headerName: Rendelésszám
    rowGroup: true
    enableRowGroup: true
  - field: cikkszam
    headerName: Cikk
  - field: itszam
    headerName: IT
  - field: szinkod
    headerName: Szín
    rowGroup: true
    enableRowGroup: true
  - field: helynev
    headerName: Hely
    pivot: true
    enablePivot: true
  - field: db
    headerName: db
    type: numericColumn
    aggFunc: sum
  mssql: >-
    WITH mlap (rendelesszam, szinkod, hely, db) AS (
    SELECT rendelesszam, szinkod, hely, SUM(db) AS db FROM rendelesmunkalap
    WHERE munkalapazonosito LIKE '4%'
    GROUP BY rendelesszam, szinkod, hely
    )
    SELECT fej.cikkszam, fej.itszam, mlap.*, helyek.rhely AS helynev FROM mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    WHERE fej.rendelesdatum > '2018-11-01'
    ORDER BY mlap.rendelesszam, mlap.szinkod, mlap.hely

ehukeszlet:
  title: Termék készlet
  pivotMode: true
  sideBar: true
  columnDefs:
  - field: rendelesszam
    headerName: Rendelésszám
    rowGroup: true
    enableRowGroup: true
  - field: cikkszam
    headerName: Cikk
  - field: itszam
    headerName: IT
  - field: szinkod
    headerName: Szín
    rowGroup: true
    enableRowGroup: true
  - field: meret
    headerName: Méret
    rowGroup: true
    enableRowGroup: true
  - field: helynev
    headerName: Hely
    pivot: true
    enablePivot: true
  - field: db
    headerName: db
    type: numericColumn
    aggFunc: sum
  mssql: >-
    WITH mlap (rendelesszam, szinkod, meret, hely, db) AS (
    SELECT rendelesszam, szinkod, meret, hely, SUM(db) AS db FROM rendelesmunkalap
    WHERE munkalapazonosito LIKE '2%'
    GROUP BY rendelesszam, szinkod, meret, hely
    )
    SELECT fej.cikkszam, fej.itszam, mlap.*, helyek.rhely AS helynev FROM mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    WHERE fej.rendelesdatum > '2018-11-01'
    ORDER BY mlap.rendelesszam, mlap.szinkod, mlap.meret, mlap.hely

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
