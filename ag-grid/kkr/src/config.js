import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
  - field: torzs
    headerName: Törzsadatok
  - field: keszlet
    headerName: Készlet
  - field: mozgas
    headerName: Mozgás
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
    keszlet:
    - value:  E-H-U
      path:   ehukeszlet
    - value:  Kellék
      path:   kellekkeszlet
    mozgas:
    - value:  "E-H-U"
      path:   ehumozgas
    - value:  "Kellék"
      path:   kellekmozgas
    logisztika:
    - value:  "-"
      path:   logisztika_leadas
    - value:  "Update"
      path:   mssql_update
    kotode:
    - value:  "-"
      path:   kotode_leadas
    varroda:
    - value:  "-"
      path:   varroda_leadas

mssql_update:
  title: Update
  columnDefs:
  - field: result
    headerName: Végrehajtva
  mssql: >-
    WITH maxhsz (munkalapazonosito, hsz) AS (
        SELECT munkalapazonosito, MAX(hsz) FROM rendeleskartonmozgas GROUP BY munkalapazonosito
    ),
    lasthely (munkalapazonosito, hely) AS (
        SELECT mozgas.munkalapazonosito, mozgas.hely FROM rendeleskartonmozgas AS mozgas JOIN maxhsz ON maxhsz.hsz = mozgas.hsz
    )
    UPDATE rendelesmunkalap SET hely = lasthely.hely FROM lasthely WHERE lasthely.munkalapazonosito = rendelesmunkalap.munkalapazonosito AND
        ( rendelesmunkalap.hely IS NULL OR lasthely.hely != rendelesmunkalap.hely )

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

ehukeszlet:
  title: E-H-U készlet
  #pivotMode: true
  sideBar: true
  rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
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
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito

kellekkeszlet:
  title: Kellék készlet
  #pivotMode: true
  sideBar: true
  rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
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
  - field: kellektipusnev
    headerName: Kelléktípus
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
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito

ehumozgas:
  title: E-H-U mozgás
  sideBar: true
  #rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
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
    enableRowGroup: true
  - field: helynev
    headerName: Hely
    enableRowGroup: true
  - field: datum
    headerName: Dátum
  - field: szinkod
    headerName: Szín
    enableRowGroup: true
  - field: meret
    headerName: Méret
    enableRowGroup: true
  - field: db
    headerName: db
    type: numericColumn
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
      mlap.utem, mlap.szinkod, mlap.meret, mlap.munkalapazonosito, mlap.kellektipus, mlap.db,
      mozgas.datum, mozgas.hely
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN rendeleskartonmozgas AS mozgas ON mozgas.munkalapazonosito = mlap.munkalapazonosito
    LEFT JOIN helyek ON helyek.azon = mozgas.hely
    WHERE mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N'
    ORDER BY mlap.munkalapazonosito, mozgas.datum

kellekmozgas:
  title: Kellék mozgás
  sideBar: true
  #rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
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
    enableRowGroup: true
  - field: helynev
    headerName: Hely
    enableRowGroup: true
  - field: datum
    headerName: Dátum
  - field: szinkod
    headerName: Szín
    enableRowGroup: true
  - field: kellektipusnev
    headerName: Kelléktípus
    enableRowGroup: true
  - field: db
    headerName: db
    type: numericColumn
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
      mlap.utem, mlap.szinkod, mlap.meret, mlap.munkalapazonosito, mlap.kellektipus, mlap.db,
      mozgas.datum, mozgas.hely
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN rendeleskartonmozgas AS mozgas ON mozgas.munkalapazonosito = mlap.munkalapazonosito
    LEFT JOIN helyek ON helyek.azon = mozgas.hely
    LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
    WHERE mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N'
    ORDER BY mlap.munkalapazonosito, mozgas.datum

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
