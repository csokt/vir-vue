import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
  - field: torzs
    headerName: Törzsadatok
  - field: rendeles
    headerName: Rendelések
  - field: munkalap
    headerName: Munkalap
  - field: tervezes
    headerName: Tervezés
  - field: logisztika
    headerName: Logisztika
  - field: kotode
    headerName: Kötöde
  - field: varroda
    headerName: Varroda
  menu:
    torzs:
    - value:  Ügyfelek
      path:   ugyfelek
    - value:  Telephelyek
      path:   telephelyek
    - value:  Üzemek
      path:   uzemek
    - value:  Helyek
      path:   helyek
    - value:  Gépek
      path:   gepek
    - value:  Hely-gép kapcsolat
      path:   helyek_gep_rel
    - value:  Normák
      path:   normak
    rendeles:
    - value:  "Rendelésfej"
      path:   rendelesfej
    - value:  "Rendeléssor"
      path:   rendelessor
    munkalap:
    - value:  E-H-U
      path:   ehu_munkalap
    - value:  Kellék
      path:   kellek_munkalap
    - value:  "E-H-U mozgás"
      path:   ehu_munkalap_mozgas
    - value:  "Kellék mozgás"
      path:   kellek_munkalap_mozgas
    - value:  "Adatok frissítése"
      path:   mssql_munkalap_update
    tervezes:
    - value:  "Kapacitásigény"
      path:   kapacitasigeny
    logisztika:
    - value:  "-"
      path:   logisztika_leadas
    kotode:
    - value:  "-"
      path:   kotode_leadas
    varroda:
    - value:  "-"
      path:   varroda_leadas

mssql_munkalap_update:
  title: Munkalap adatok frissítése
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

ugyfelek:
  title: Ügyfelek
  columnDefs:
  - field: ugyfelkod
    headerName: Ügyfélkód
    cellStyle: {'background-color': 'beige'}
  - field: ugyfelnev
    headerName: Ügyfélnév
  - field: mennyiseg
    headerName: Rendelt
    type: numericColumn
  - field: nemgyarthatodb
    headerName: Nem gyártható
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkotesrevar
    headerName: Kötésre vár
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumlekotve
    headerName: Lekötve
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkiszallitva
    headerName: Kiszállítva
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumszamlazva
    headerName: Számlázva
    filter: agNumberColumnFilter
    type: numericColumn
  onClick:
    ugyfelkod:
      path: rendelesfej
      where: partnerkod='\${ugyfelkod}'
  mssql: >-
    WITH ugyfel_ids (partnerkod) AS (
      SELECT DISTINCT partnerkod FROM rendelesfej
      WHERE statusz = 'N'
    ),
      fej (partnerkod, mennyiseg, nemgyarthatodb, sumkotesrevar, sumlekotve, sumkiszallitva, sumszamlazva) AS (
      SELECT partnerkod, SUM(mennyiseg) AS mennyiseg, SUM(nemgyarthatodb) AS nemgyarthatodb, SUM(sumkotesrevar) AS sumkotesrevar,
        SUM(sumlekotve) AS sumlekotve, SUM(sumkiszallitva) AS sumkiszallitva, SUM(sumszamlazva) AS sumszamlazva
      FROM rendelesfej AS fej
      WHERE fej.statusz = 'N'
      GROUP BY partnerkod
    )
    SELECT ugyfel.ugyfelkod, ugyfel.nev AS ugyfelnev,
      fej.mennyiseg, fej.nemgyarthatodb, fej.sumkotesrevar, fej.sumlekotve, fej.sumkiszallitva, fej.sumszamlazva
    FROM ugyfel
    JOIN ugyfel_ids ON ugyfel_ids.partnerkod = ugyfel.ugyfelkod AND ugyfel.aktiv = 'A'
    JOIN fej ON fej.partnerkod = ugyfel.ugyfelkod
    WHERE {where}
    ORDER BY ugyfel.ugyfelkod

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
  mssql: SELECT * FROM telephelyek WHERE {where}

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
  mssql: SELECT uzemek.*, telephely FROM uzemek JOIN telephelyek on uzemek.telephelykod = telephelyek.telephelykod WHERE statusz = 'A' AND {where}

gepek:
  title: Gépek
  defaultColDef:
    filter: true
  columnDefs:
  - field: gepkod
    headerName: Gépkód
    filter: agNumberColumnFilter
    type: numericColumn
  - field: gepnev
    headerName: Gépnév
  - field: statusz
    headerName: Státusz
  mssql: SELECT * FROM gep WHERE statusz = 'A' AND {where} ORDER BY gepkod

helyek:
  title: Helyek
  defaultColDef:
    filter: true
  columnDefs:
  - field: azon
    headerName: Helykód
    filter: agNumberColumnFilter
    type: numericColumn
  - field: hely
    headerName: Helynév
  - field: rhely
    headerName: Rövid név
  - field: sorrend
    headerName: Sorrend
    type: numericColumn
  mssql: SELECT * FROM helyek WHERE {where} ORDER BY sorrend, azon

helyek_gep_rel:
  title: Hely-gép kapcsolat
  defaultColDef:
    filter: true
  columnDefs:
  - field: azon
    headerName: Helykód
    filter: agNumberColumnFilter
    type: numericColumn
  - field: hely
    headerName: Helynév
  - field: rhely
    headerName: Rövid név
  - field: sorrend
    headerName: Sorrend
    type: numericColumn
  - field: gepkod
    headerName: Gépkód
    filter: agNumberColumnFilter
    type: numericColumn
  - field: gepnev
    headerName: Gépnév
  - field: statusz
    headerName: Státusz
  mssql: >-
    DECLARE @helyek_gep_rel TABLE (gepkod int, azon int);
    INSERT INTO @helyek_gep_rel (gepkod, azon) VALUES
      (2,38),(2,25),(2,35),(2,24),(3,25),(3,35),(3,38),(3,24),(4,25),(4,35),(4,24),(5,24),(5,25),(5,35),(5,38),(7,21),(7,26),(8,37),(9,37),(10,26),(11,21),(12,38),(13,38),(14,38),(15,38),(12,22),(13,22),(14,22),(15,22),(16,24),(16,25),(16,38),(16,35),(17,24),(18,24),(18,35),(17,38),(18,25),(19,35),(19,38),(19,25),(19,24),(20,25),(20,38),(20,21),(20,35),(20,26),(21,24),(22,38),(22,24),(22,25),(22,35),(24,25),(24,38),(24,24),(24,35),(25,38),(25,22),(26,22),(26,38),(26,23),(27,25),(27,38),(27,24),(30,33),(31,38),(31,22),(34,33),(36,30),(38,26)
      ;
    SELECT helyek.*, gep.* FROM @helyek_gep_rel AS rel JOIN gep ON gep.gepkod = rel.gepkod JOIN helyek ON helyek.azon = rel.azon
    ORDER BY helyek.sorrend, gep.gepkod

normak:
  title: Normák
  defaultColDef:
    filter: true
  columnDefs:
  - field: cikkszam
    headerName: Cikkszám
  - field: muveletkod
    headerName: Műveletkód
    type: numericColumn
  - field: muveletnev
    headerName: Műveletnév
  - field: elokeszito
    headerName: Előkészítő
    type: numericColumn
  - field: normaperc
    headerName: Normaperc
    type: numericColumn
  - field: gepkod
    headerName: Gépkód
    type: numericColumn
  - field: gepnev
    headerName: Gépnév
  mssql: >-
    WITH cikkszam_ids (cikkszam) AS (
      SELECT DISTINCT cikkszam FROM rendelesfej
      WHERE statusz = 'N'
    )
    SELECT normak.cikkszam, normak.muveletkod, normak.muveletnev, normak.elokeszito, normak.normaperc, normak.gepkod, gep.gepnev
    FROM normak
    JOIN cikkszam_ids ON cikkszam_ids.cikkszam = normak.cikkszam
    JOIN gep ON gep.gepkod = normak.gepkod
    WHERE {where}
    ORDER BY normak.cikkszam, CAST(normak.muveletkod AS int)

rendelesfej:
  title: Rendelésfej
  defaultColDef:
    filter: true
  columnDefs:
  - field: partnerkod
    headerName: Ügyfélkód
  - field: partnerrendelesszam
    headerName: Rendelésszám
    cellStyle: {'background-color': 'beige'}
  - field: itszam
    headerName: IT
  - field: utem
    headerName: Ütem
  - field: cikkszam
    headerName: Cikkszám
  - field: cikkmegnevezes
    headerName: Cikknév
  - field: rendelesdatum
    headerName: Rendelés ideje
  - field: hatarido
    headerName: Határidő
  - field: mennyiseg
    headerName: Rendelt
    filter: agNumberColumnFilter
    type: numericColumn
  - field: nemgyarthatodb
    headerName: Nem gyártható
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkotesrevar
    headerName: Kötésre vár
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumlekotve
    headerName: Lekötve
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkiszallitva
    headerName: Kiszállítva
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumszamlazva
    headerName: Számlázva
    filter: agNumberColumnFilter
    type: numericColumn
  - field: ehu
    headerName: E-H-U
    cellStyle: {'background-color': 'beige'}
  - field: kellek
    headerName: Kellék
    cellStyle: {'background-color': 'beige'}
  onClick:
    partnerrendelesszam:
      path: rendelessor
      where: sor.rendelesszam='\${rendelesszam}'
    ehu:
      path: ehu_munkalap
      where: mlap.rendelesszam='\${rendelesszam}'
    kellek:
      path: kellek_munkalap
      where: mlap.rendelesszam='\${rendelesszam}'
  mssql: SELECT *, partnerrendelesszam AS ehu, partnerrendelesszam AS kellek FROM rendelesfej AS fej WHERE fej.statusz = 'N' AND {where}

rendelessor:
  title: Rendeléssor
  defaultColDef:
    filter: true
  columnDefs:
  - field: partnerkod
    headerName: Ügyfélkód
  - field: partnerrendelesszam
    headerName: Rendelésszám
  - field: itszam
    headerName: IT
  - field: utem
    headerName: Ütem
  - field: cikkszam
    headerName: Cikkszám
  - field: rendelesdatum
    headerName: Rendelés ideje
  - field: hatarido
    headerName: Határidő
  - field: szinkod
    headerName: Színkód
  - field: db
    headerName: Rendelt
    filter: agNumberColumnFilter
    type: numericColumn
  - field: nemgyarthatodb
    headerName: Nem gyártható
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkotesrevar
    headerName: Kötésre vár
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumlekotve
    headerName: Lekötve
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumkiszallitva
    headerName: Kiszállítva
    filter: agNumberColumnFilter
    type: numericColumn
  - field: sumszamlazva
    headerName: Számlázva
    filter: agNumberColumnFilter
    type: numericColumn
  mssql: SELECT sor.* FROM rendelessorok AS sor JOIN rendelesfej AS fej ON fej.rendelesszam = sor.rendelesszam WHERE fej.statusz = 'N' AND {where}

kapacitasigeny:
  title: Kapacitásigény
  sideBar: true
  rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
  columnDefs:
  - field: munkalap_tipus
    headerName: Munkalap
    cellStyle: {'background-color': 'beige'}
    enableRowGroup: true
    enablePivot: true
  - field: cikkszam
    headerName: Cikkszám
    enableRowGroup: true
    enablePivot: true
  - field: itszam
    headerName: IT
    enableRowGroup: true
    enablePivot: true
  - field: partnerrendelesszam
    headerName: Rendelésszám
    enableRowGroup: true
    enablePivot: true
  - field: helynev
    headerName: Helynév
    enableRowGroup: true
    enablePivot: true
  - field: gepnev
    headerName: Gépnév
    enableRowGroup: true
    enablePivot: true
  - field: ugyfelnev
    headerName: Megrendelő
    enableRowGroup: true
    enablePivot: true
  - field: hatarido
    headerName: Határidő
  - field: ossz_rendelt_db
    headerName: Össz rendelt db
    type: numericColumn
  - field: kiszallitasra_var
    headerName: Kiszállításra vár
    type: numericColumn
  - field: rendelt_db
    headerName: Területen db
    type: numericColumn
  - field: rendelt
    headerName: Rendelt perc
    type: numericColumn
    cellStyle: {'background-color': 'beige'}
    aggFunc: sum
  - field: kesz
    headerName: Kész perc
    type: numericColumn
    aggFunc: sum
  - field: hatralek
    headerName: Fennmaradó perc
    type: numericColumn
    aggFunc: sum
  onClick:
    rendelt:
      path: normak
      where: normak.cikkszam='\${cikkszam}' AND normak.gepkod='\${gepkod}' AND normak.elokeszito='\${elokeszito}'
    munkalap_tipus:
      path: \${elokeszito?'kellek_munkalap':'ehu_munkalap'}
      where: ugyfel.ugyfelkod='\${partnerkod}' AND mlap.cikkszam='\${cikkszam}' AND mlap.rendelesszam='\${rendelesszam}' AND mlap.hely='\${hely}'
  mssql: >-
    DECLARE @helyek_gep_rel TABLE (gepkod int, azon int);
    INSERT INTO @helyek_gep_rel (gepkod, azon) VALUES
      (2,38),(2,25),(2,35),(2,24),(3,25),(3,35),(3,38),(3,24),(4,25),(4,35),(4,24),(5,24),(5,25),(5,35),(5,38),(7,21),(7,26),(8,37),(9,37),(10,26),(11,21),(12,38),(13,38),(14,38),(15,38),(12,22),(13,22),(14,22),(15,22),(16,24),(16,25),(16,38),(16,35),(17,24),(18,24),(18,35),(17,38),(18,25),(19,35),(19,38),(19,25),(19,24),(20,25),(20,38),(20,21),(20,35),(20,26),(21,24),(22,38),(22,24),(22,25),(22,35),(24,25),(24,38),(24,24),(24,35),(25,38),(25,22),(26,22),(26,38),(26,23),(27,25),(27,38),(27,24),(30,33),(31,38),(31,22),(34,33),(36,30),(38,26)
      ;
    WITH
      rendelt (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, ROUND(SUM(mlap.db * normak.normaperc),0) AS perc
        FROM rendelesmunkalap AS mlap
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
        JOIN normak ON normak.cikkszam = mlap.cikkszam AND normak.elokeszito = CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END
        JOIN @helyek_gep_rel AS rel ON rel.azon = mlap.hely AND rel.gepkod = normak.gepkod
        WHERE mlap.db > 0 AND fej.statusz = 'N'
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod
      ),
      kesz (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, ROUND(SUM(kodol.darab * kodol.normaperdb),0) AS perc
        FROM rendelesmatrica AS kodol
        JOIN rendelesmunkalap AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
        JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
        WHERE mlap.db > 0 AND fej.statusz = 'N'
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod
      ),
      mlap_db (partnerkod, cikkszam, rendelesszam, elokeszito, hely, db) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AS elokeszito, mlap.hely, SUM(mlap.db) AS db
        FROM rendelesmunkalap AS mlap
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
        WHERE mlap.db > 0 AND fej.statusz = 'N'
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END, mlap.hely
      )
    SELECT
      fej.itszam,
      CONVERT(VARCHAR, fej.hatarido, 23) AS hatarido,
      CASE rendelt.elokeszito WHEN 0 THEN 'E-H-U' WHEN 1 THEN 'Kellék' END AS munkalap_tipus,
      ugyfel.nev AS ugyfelnev,
      rendelt.partnerkod,
      rendelt.cikkszam,
      rendelt.rendelesszam,
      fej.partnerrendelesszam,
      rendelt.elokeszito,
      rendelt.hely,
      helyek.hely AS helynev,
      rendelt.gepkod,
      gep.gepnev,
      fej.mennyiseg AS ossz_rendelt_db,
      fej.mennyiseg - fej.sumkiszallitva AS kiszallitasra_var,
      mlap_db.db AS rendelt_db,
      rendelt.perc AS rendelt,
      ISNULL(kesz.perc,0) AS kesz,
      ISNULL(rendelt.perc,0) - ISNULL(kesz.perc,0) AS hatralek
    FROM rendelt
    JOIN rendelesfej AS fej ON fej.rendelesszam = rendelt.rendelesszam
    JOIN gep ON rendelt.gepkod = gep.gepkod
    JOIN ugyfel ON ugyfel.ugyfelkod = rendelt.partnerkod AND ugyfel.aktiv = 'A'
    JOIN mlap_db ON mlap_db.partnerkod = rendelt.partnerkod AND mlap_db.cikkszam = rendelt.cikkszam AND mlap_db.rendelesszam = rendelt.rendelesszam AND
                      mlap_db.elokeszito = rendelt.elokeszito AND mlap_db.hely = rendelt.hely
    LEFT JOIN kesz ON kesz.partnerkod = rendelt.partnerkod AND kesz.cikkszam = rendelt.cikkszam AND kesz.rendelesszam = rendelt.rendelesszam AND
                      kesz.elokeszito = rendelt.elokeszito AND kesz.hely = rendelt.hely AND kesz.gepkod = rendelt.gepkod
    LEFT JOIN helyek ON helyek.azon = rendelt.hely
    WHERE {where}
    ORDER BY helyek.hely, gep.gepnev, ugyfel.nev, rendelt.cikkszam

ehu_munkalap:
  title: E-H-U munkalapok
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
    cellStyle: {'background-color': 'beige'}
  - field: kartonszam
    headerName: Kartonszám
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
  onClick:
    munkalapazonosito:
      path: ehu_munkalap_mozgas
      where: mlap.munkalapazonosito='\${munkalapazonosito}'
  mssql: >-
    SELECT
      fej.cikkszam, fej.itszam, fej.partnerrendelesszam,
      ugyfel.nev AS ugyfelnev,
      helyek.rhely AS helynev,
      mlap.munkalapazonosito, mlap.kartonszam, mlap.utem, mlap.szinkod, mlap.hely, mlap.meret, mlap.kellektipus, mlap.db
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    WHERE (mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N') AND {where}
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito

kellek_munkalap:
  title: Kellék munkalapok
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
    cellStyle: {'background-color': 'beige'}
  - field: kartonszam
    headerName: Kartonszám
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
  onClick:
    munkalapazonosito:
      path: kellek_munkalap_mozgas
      where: mlap.munkalapazonosito='\${munkalapazonosito}'
  mssql: >-
    SELECT
      fej.cikkszam, fej.itszam, fej.partnerrendelesszam,
      ugyfel.nev AS ugyfelnev,
      helyek.rhely AS helynev,
      szotar.nev AS kellektipusnev,
      mlap.munkalapazonosito, mlap.kartonszam, mlap.utem, mlap.szinkod, mlap.hely, mlap.meret, mlap.kellektipus, mlap.db
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN helyek ON helyek.azon = mlap.hely
    LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
    WHERE (mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N') AND {where}
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito

ehu_munkalap_mozgas:
  title: E-H-U munkalap mozgás
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
  - field: kartonszam
    headerName: Kartonszám
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
      mlap.munkalapazonosito, mlap.kartonszam, mlap.utem, mlap.szinkod, mlap.meret, mlap.kellektipus, mlap.db,
      mozgas.datum, mozgas.hely
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN rendeleskartonmozgas AS mozgas ON mozgas.munkalapazonosito = mlap.munkalapazonosito
    LEFT JOIN helyek ON helyek.azon = mozgas.hely
    WHERE (mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N') AND {where}
    ORDER BY mlap.munkalapazonosito, mozgas.datum

kellek_munkalap_mozgas:
  title: Kellék munkalap mozgás
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
  - field: kartonszam
    headerName: Kartonszám
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
      mlap.munkalapazonosito, mlap.kartonszam, mlap.utem, mlap.szinkod, mlap.meret, mlap.kellektipus, mlap.db,
      mozgas.datum, mozgas.hely
    FROM rendelesmunkalap AS mlap
    JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
    JOIN ugyfel  ON ugyfel.ugyfelkod = fej.partnerkod AND ugyfel.aktiv = 'A'
    LEFT JOIN rendeleskartonmozgas AS mozgas ON mozgas.munkalapazonosito = mlap.munkalapazonosito
    LEFT JOIN helyek ON helyek.azon = mozgas.hely
    LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
    WHERE (mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N') AND {where}
    ORDER BY mlap.munkalapazonosito, mozgas.datum

`

const localeText = {
  // for filter panel
  // page: 'daPage',
  // more: 'daMore',
  // to: 'daTo',
  // of: 'daOf',
  // next: 'daNexten',
  // last: 'daLasten',
  // first: 'daFirsten',
  // previous: 'daPreviousen',
  // loadingOoo: 'daLoading...',

  // for set filter
  selectAll: 'Összes',
  searchOoo: 'Keres...',
  // blanks: 'daBlanc',

  // for number filter and text filter
  filterOoo: 'Szűrő...',
  // applyFilter: 'daApplyFilter...',
  // equals: 'daEquals',
  // notEquals: 'daNotEqual',

  // for number filter
  // lessThan: 'daLessThan',
  // greaterThan: 'daGreaterThan',
  // lessThanOrEqual: 'daLessThanOrEqual',
  // greaterThanOrEqual: 'daGreaterThanOrEqual',
  // inRange: 'daInRange',

  // for text filter
  // contains: 'daContains',
  // notContains: 'daNotContains',
  // startsWith: 'daStarts dawith',
  // endsWith: 'daEnds dawith',

  // filter conditions
  // andCondition: 'daAND',
  // orCondition: 'daOR',

  // the header of the default group column
  // group: 'laGroup',

  // tool panel
  columns: 'Oszlopok',
  filters: 'Szűrők',
  // rowGroupColumns: 'laPivot Cols',
  rowGroupColumnsEmptyMessage: 'Húzza ide a csoportmezőt',
  // valueColumns: 'laValue Cols',
  pivotMode: 'Kimutatástábla',
  groups: 'Csoportok',
  values: 'Összegzés',
  pivots: 'Oszlopok',
  valueColumnsEmptyMessage: 'Húzza ide az adatmezőt',
  pivotColumnsEmptyMessage: 'Húzza ide az oszlopmezőt',
  // toolPanelButton: 'la tool panel',

  // other
  noRowsToShow: 'Nincs megjeleníthető adat',

  // enterprise menu
  pinColumn: 'Oszlop rögzítése',
  // valueAggregation: 'laValue Agg',
  autosizeThiscolumn: 'Ezen oszlop átméretezése',
  autosizeAllColumns: 'Összes oszlop átméretezése',
  groupBy: 'Csoportosít',
  ungroupBy: 'Nem csoportosít',
  resetColumns: 'Oszlopok alaphelyzetbe',
  expandAll: 'Összes kinyitása',
  collapseAll: 'Összes becsukása',
  // toolPanel: 'laTool Panelo',
  // export: 'laExporto',
  // csvExport: 'laCSV Exportp',
  // excelExport: 'laExcel Exporto (.xlsx)',
  // excelXmlExport: 'laExcel Exporto (.xml)',

  // enterprise menu (charts)
  // chartRange: 'laChart Range',

  // columnRangeChart: 'laColumn',
  // groupedColumnChart: 'laGrouped',
  // stackedColumnChart: 'laStacked',
  // normalizedColumnChart: 'la100% Stacked',

  // barRangeChart: 'laBar',
  // groupedBarChart: 'laGrouped',
  // stackedBarChart: 'laStacked',
  // normalizedBarChart: 'la100% Stacked',

  // lineRangeChart: 'laLine',

  // pieRangeChart: 'laPie',
  // pieChart: 'laPie',
  // doughnutChart: 'laDoughnut',

  // areaRangeChart: 'laArea',
  // areaChart: 'laArea',
  // stackedAreaChart: 'laStacked',
  // normalizedAreaChart: 'la100% Stacked',

  // enterprise menu pinning
  pinLeft: 'Balra',
  pinRight: 'Jobbra',
  noPin: 'Nincs',

  // enterprise menu aggregation and status bar
  // sum: 'laSum',
  // min: 'laMin',
  // max: 'laMax',
  // none: 'laNone',
  // count: 'laCount',
  // average: 'laAverage',
  // filteredRows: 'laFiltered',
  // selectedRows: 'laSelected',
  // totalRows: 'laTotal Rows',
  // totalAndFilteredRows: 'laRows',

  // standard menu
  // copy: 'laCopy',
  // copyWithHeaders: 'laCopy Wit hHeaders',
  // ctrlC: 'ctrl n C',
  // paste: 'laPaste',
  // ctrlV: 'ctrl n V',

  // charts
  // settings: 'laSettings',
  // data: 'laData',
  // format: 'laFormat',
  // categories: 'laCategories',
  // series: 'laSeries',
  // axis: 'laAxis',
  // color: 'laColor',
  // thickness: 'laThickness',
  // xRotation: 'laX Rotation',
  // yRotation: 'laY Rotation',
  // ticks: 'laTicks',
  // width: 'laWidth',
  // length: 'laLength',
  // padding: 'laPadding',
  // chart: 'laChart',
  // title: 'laTitle',
  // font: 'laFont',
  // top: 'laTop',
  // right: 'laRight',
  // bottom: 'laBottom',
  // left: 'laLeft',
  // labels: 'laLabels',
  // size: 'laSize',
  // legend: 'laLegend',
  // position: 'laPosition',
  // markerSize: 'laMarker Size',
  // markerStroke: 'laMarker Stroke',
  // markerPadding: 'laMarker Padding',
  // itemPaddingX: 'laItem Padding X',
  // itemPaddingY: 'laItem Padding Y',
  // strokeWidth: 'laStroke Width',
  // offset: 'laOffset',
  // tooltips: 'laTooltips',
  // offsets: 'laOffsets',
  // callout: 'laCallout',
  // markers: 'laMarkers',
  // shadow: 'laShadow',
  // blur: 'laBlur',
  // xOffset: 'laX Offset',
  // yOffset: 'laY Offset',
  // lineWidth: 'laLine Width',
  // normal: 'laNormal',
  // bold: 'laBold',
  // italic: 'laItalic',
  // boldItalic: 'laBold Italic',
  // fillOpacity: 'laFill Opacity',
  // strokeOpacity: 'laLine Opacity',
  // groupedColumnTooltip: 'laGrouped',
  // stackedColumnTooltip: 'laStacked',
  // normalizedColumnTooltip: 'la100% Stacked',
  // groupedBarTooltip: 'laGrouped',
  // stackedBarTooltip: 'laStacked',
  // normalizedBarTooltip: 'la100% Stacked',
  // pieTooltip: 'laPie',
  // doughnutTooltip: 'laDoughnut',
  // lineTooltip: 'laLine',
  // groupedAreaTooltip: 'laGrouped',
  // stackedAreaTooltip: 'laStacked',
  // normalizedAreaTooltip: 'la100% Stacked'
  dummy: 'dummy'
}

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
  Config.localeText = localeText
} catch (err) {
  console.log(err)
}

export default Config
