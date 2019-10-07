import sql from './sql'
import yaml from 'js-yaml'
let configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
    - { headerName: Törzsadatok,     field: torzs }
    - { headerName: Rendelések,      field: rendeles }
    - { headerName: Munkalap,        field: munkalap }
    - { headerName: Tervezés,        field: tervezes }
    - { headerName: Logisztika,      field: logisztika }
    - { headerName: Kötöde,          field: kotode }
    - { headerName: Varroda,         field: varroda }

  menu:
    torzs:
      - { value: Ügyfelek,           path: ugyfelek }
      - { value: Cikktörzs,          path: cikktorzs }
      - { value: Normák,             path: normak }
      - { value: Telephelyek,        path: telephelyek }
      - { value: Üzemek,             path: uzemek }
      - { value: Dolgozók,           path: dolgozok }
      - { value: Helyek,             path: helyek }
      - { value: Gépek,              path: gepek }
      - { value: Hely-gép kapcsolat, path: helyek_gep_rel }
    rendeles:
      - { value: Rendelésfej,        path: rendelesfej }
      - { value: Rendeléssor,        path: rendelessor }
    munkalap:
      - { value: E-H-U,              path: ehu_munkalap }
      - { value: Kellék,             path: kellek_munkalap }
      - { value: Összes,             path: osszes_munkalap }
      - { value: E-H-U mozgás,       path: ehu_munkalap_mozgas }
      - { value: Kellék mozgás,      path: kellek_munkalap_mozgas }
      - { value: Összes mozgás,      path: osszes_munkalap_mozgas }
      # - { value: Adatok frissítése,  path: mssql_munkalap_update }
    tervezes:
      - { value: Kapacitásigény,     path: kapacitasigeny }
      - { value: Kapacitásigény2,    path: kapacitasigeny2 }
    logisztika:
      - { value: '-',                path: logisztika_leadas }
    kotode:
      - { value: '-',                path: kotode_leadas }
    varroda:
      - { value: '-',                path: varroda_leadas }



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

###############################################################################################################################################################
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
    SELECT ugyfel.ugyfelkod, ugyfel.nev AS ugyfelnev,
      fej.mennyiseg, fej.nemgyarthatodb, fej.sumkotesrevar, fej.sumlekotve, fej.sumkiszallitva, fej.sumszamlazva
    FROM ${sql.ugyfel} AS ugyfel
    JOIN ${sql.rendelesfejGroupByPartnerkod} AS fej ON fej.partnerkod = ugyfel.ugyfelkod
    WHERE {where}
    ORDER BY ugyfel.ugyfelkod

###############################################################################################################################################################
cikktorzs:
  title: Cikktörzs
  defaultColDef:
    filter: true
  columnDefs:
    - field: cikkszam
      headerName: Cikkszám
      cellStyle: {'background-color': 'beige'}
    - field: markanev
      headerName: Márkanév
    - field: partnercikk
      headerName: Partner cikkszám
    - field: cikknev
      headerName: Cikknév
    - field: eladasiar
      headerName: Eladási ár
      filter: agNumberColumnFilter
      type: numericColumn
    - field: elfogadottar
      headerName: Elfogadott ár
      filter: agNumberColumnFilter
      type: numericColumn
    - field: ugyfelnev
      headerName: Ügyfél
  onClick:
    cikkszam:
      path: rendelesfej
      where: cikkszam='\${cikkszam}'
  mssql: SELECT * FROM ${sql.cikktorzsView} AS cikktorzs WHERE {where} ORDER by cikkszam

###############################################################################################################################################################
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

###############################################################################################################################################################
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
  mssql: SELECT * FROM ${sql.uzemekView} AS uzemek WHERE {where}

###############################################################################################################################################################
dolgozok:
  title: Dolgozók
  defaultColDef:
    filter: true
  columnDefs:
    - field: dolgozokod
      headerName: Dolgozókód
    - field: dolgozonev
      headerName: Dolgozónév
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
  mssql: SELECT * FROM ${sql.dolgtrView} AS dolgtr WHERE {where}

###############################################################################################################################################################
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
  mssql: SELECT * FROM ${sql.gep} AS gep WHERE {where} ORDER BY gepkod

###############################################################################################################################################################
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

###############################################################################################################################################################
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
    ${sql.HelyekGepRelTable}
    SELECT * FROM ${sql.helyek_gep_rel_view} AS helyek_gep_rel_view
    ORDER BY sorrend, gepkod

###############################################################################################################################################################
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
    - field: kellek
      headerName: Kellék
      type: numericColumn
    - field: normaperc
      headerName: Normaperc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(3) : value"
    - field: gepkod
      headerName: Gépkód
      type: numericColumn
    - field: gepnev
      headerName: Gépnév
    - field: felszabaditas
      headerName: Felszabadítás
    - field: bontaskod
      headerName: Bontáskód
      type: numericColumn
  mssql: >-
    SELECT * FROM ${sql.normakView} AS normak
    WHERE {where}
    ORDER BY cikkszam, muveletkod
  where:
    - label: Gyártás alatt
      value: nyitott_cikkszam IS NOT NULL

###############################################################################################################################################################
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
    - field: ehu
      headerName: E-H-U
      cellStyle: {'background-color': 'beige'}
    - field: kellek
      headerName: Kellék
      cellStyle: {'background-color': 'beige'}
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
  onClick:
    partnerrendelesszam:
      path: rendelessor
      where: sor.rendelesszam='\${rendelesszam}'
    ehu:
      path: ehu_munkalap
      where: rendelesszam='\${rendelesszam}'
    kellek:
      path: kellek_munkalap
      where: rendelesszam='\${rendelesszam}'
  mssql: >-
    SELECT fej.*, ehu_mlap.tetelszam AS ehu, kellek_mlap.tetelszam AS kellek
    FROM rendelesfej AS fej
    LEFT JOIN ${sql.munkalapGroupByRendelesszamElokeszito} AS ehu_mlap    ON ehu_mlap.rendelesszam    = fej.rendelesszam AND ehu_mlap.elokeszito = 0
    LEFT JOIN ${sql.munkalapGroupByRendelesszamElokeszito} AS kellek_mlap ON kellek_mlap.rendelesszam = fej.rendelesszam AND kellek_mlap.elokeszito = 1
    WHERE {where}
  where:
    - label: Nyitott
      value: fej.statusz = 'N'
    - label: Törölt
      value: fej.statusz = 'T'

###############################################################################################################################################################
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
  mssql: SELECT sor.* FROM rendelessorok AS sor JOIN rendelesfej AS fej ON fej.rendelesszam = sor.rendelesszam WHERE {where}
  where:
    - label: Nyitott
      value: fej.statusz = 'N'

###############################################################################################################################################################
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
      valueFormatter: value.toFixed(2)
      cellStyle: {'background-color': 'beige'}
      aggFunc: sum
    - field: kesz
      headerName: Kész perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: hatralek
      headerName: Fennmaradó perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
  onClick:
    rendelt:
      path: normak
      where: cikkszam='\${cikkszam}' AND gepkod='\${gepkod}' AND elokeszito='\${elokeszito}'
    munkalap_tipus:
      path: \${elokeszito?'kellek_munkalap':'ehu_munkalap'}
      where: ugyfelkod='\${partnerkod}' AND cikkszam='\${cikkszam}' AND rendelesszam='\${rendelesszam}' AND hely='\${hely}'
  mssql: >-
    ${sql.HelyekGepRelTable}
    WITH
      rendelt (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, SUM(mlap.db * normak.normaperc) AS perc
        FROM rendelesmunkalap AS mlap
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
        JOIN normak ON normak.cikkszam = mlap.cikkszam AND normak.elokeszito = CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AND normak.kellek = 0
        JOIN @helyek_gep_rel AS rel ON rel.helykod = mlap.hely AND rel.gepkod = normak.gepkod
        WHERE mlap.db > 0 AND fej.statusz = 'N'
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod
      ),
      kesz (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, SUM(kodol.darab * kodol.normaperdb) AS perc
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

###############################################################################################################################################################
kapacitasigeny2:
  title: Kapacitásigény2
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
    - field: muveletkod
      headerName: Műveletkód
      type: numericColumn
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
      valueFormatter: "value ? value.toFixed(2) : value"
      cellStyle: {'background-color': 'beige'}
      aggFunc: sum
    - field: kesz
      headerName: Kész perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: hatralek
      headerName: Fennmaradó perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
  onClick:
    rendelt:
      path: normak
      where: cikkszam='\${cikkszam}' AND gepkod='\${gepkod}' AND elokeszito='\${elokeszito}'
    munkalap_tipus:
      path: \${elokeszito?'kellek_munkalap':'ehu_munkalap'}
      where: ugyfelkod='\${partnerkod}' AND cikkszam='\${cikkszam}' AND rendelesszam='\${rendelesszam}' AND hely='\${hely}'
  mssql: >-
    ${sql.HelyekGepRelTable}
    WITH
      rendelt (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, muveletkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, normak.muveletkod, SUM(mlap.db * normak.normaperc) AS perc
        FROM rendelesmunkalap AS mlap
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam AND fej.statusz = 'N'
        JOIN normak ON normak.cikkszam = mlap.cikkszam AND normak.elokeszito = CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AND normak.kellek = 0
        JOIN @helyek_gep_rel AS rel ON rel.helykod = mlap.hely AND rel.gepkod = normak.gepkod
        WHERE mlap.db > 0
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, normak.muveletkod
      ),
      kesz (partnerkod, cikkszam, rendelesszam, elokeszito, hely, gepkod, muveletkod, perc) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, normak.muveletkod, SUM(kodol.darab * kodol.normaperdb) AS perc
        FROM rendelesmatrica AS kodol
        JOIN rendelesmunkalap AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam AND fej.statusz = 'N'
        JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
        WHERE mlap.db > 0
        GROUP BY fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, normak.elokeszito, mlap.hely, normak.gepkod, normak.muveletkod
      ),
      mlap_db (partnerkod, cikkszam, rendelesszam, elokeszito, hely, db) AS (
        SELECT
          fej.partnerkod, mlap.cikkszam, mlap.rendelesszam, CASE LEFT(mlap.munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AS elokeszito, mlap.hely, SUM(mlap.db) AS db
        FROM rendelesmunkalap AS mlap
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam AND fej.statusz = 'N'
        WHERE mlap.db > 0
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
      rendelt.muveletkod,
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
                      kesz.elokeszito = rendelt.elokeszito AND kesz.hely = rendelt.hely AND kesz.gepkod = rendelt.gepkod AND kesz.muveletkod = rendelt.muveletkod
    LEFT JOIN helyek ON helyek.azon = rendelt.hely
    WHERE {where}
    ORDER BY helyek.hely, gep.gepnev, ugyfel.nev, rendelt.cikkszam

###############################################################################################################################################################
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
      where: munkalapazonosito='\${munkalapazonosito}'
  mssql: >-
    SELECT * FROM ${sql.rendelesmunkalapView} AS mlap
    WHERE (elokeszito = 0) AND {where}
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito
  where:
    - label: Nyitott
      value: statusz = 'N'

###############################################################################################################################################################
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
      where: munkalapazonosito='\${munkalapazonosito}'
  mssql: >-
    SELECT * FROM ${sql.rendelesmunkalapView} AS mlap
    WHERE (elokeszito = 1) AND {where}
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito
  where:
    - label: Nyitott
      value: statusz = 'N'

###############################################################################################################################################################
osszes_munkalap:
  title: Összes munkalap
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
    - field: db
      headerName: db
      type: numericColumn
      aggFunc: sum
    - field: ertek
      headerName: Érték
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: rendelt_perc
      headerName: Területen perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: ugyfelnev
      headerName: Megrendelő
      enableRowGroup: true
  onClick:
    munkalapazonosito:
      path: osszes_munkalap_mozgas
      where: munkalapazonosito='\${munkalapazonosito}'
  mssql: >-
    ${sql.HelyekGepRelTable}
    SELECT * FROM ${sql.rendelesmunkalapView2} AS mlap
    WHERE {where}
    ORDER BY mlap.rendelesszam, mlap.munkalapazonosito
  where:
    - label: Nyitott
      value: statusz = 'N'

###############################################################################################################################################################
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
    - field: hova
      headerName: Hova
      enableRowGroup: true
    - field: datum
      headerName: Dátum
    - headerName: Nap
      valueGetter: data.datum.substring(0,10)
      enableRowGroup: true
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
    SELECT * FROM ${sql.rendeleskartonmozgasView} AS mozgas
    WHERE (elokeszito = 0) AND {where}
    ORDER BY datum
  where:
    - label: Ma
      value: datum >= ${sql._0napja}
    - label: 1 napja
      value: datum >= ${sql._1napja}
    - label: 2 napja
      value: datum >= ${sql._2napja}
    - label: 3 napja
      value: datum >= ${sql._3napja}
    - label: 7 napja
      value: datum >= ${sql._7napja}
    - label: 14 napja
      value: datum >= ${sql._14napja}
    - label: 30 napja
      value: datum >= ${sql._30napja}
    - label: 60 napja
      value: datum >= ${sql._60napja}
    - label: Nyitott
      value: statusz = 'N'

###############################################################################################################################################################
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
    - field: hova
      headerName: Hova
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
    SELECT * FROM ${sql.rendeleskartonmozgasView} AS mozgas
    WHERE (elokeszito = 1) AND {where}
    ORDER BY datum
  where:
    - label: Ma
      value: datum >= ${sql._0napja}
    - label: 1 napja
      value: datum >= ${sql._1napja}
    - label: 2 napja
      value: datum >= ${sql._2napja}
    - label: 3 napja
      value: datum >= ${sql._3napja}
    - label: 7 napja
      value: datum >= ${sql._7napja}
    - label: 14 napja
      value: datum >= ${sql._14napja}
    - label: 30 napja
      value: datum >= ${sql._30napja}
    - label: 60 napja
      value: datum >= ${sql._60napja}
    - label: Nyitott
      value: statusz = 'N'

###############################################################################################################################################################
osszes_munkalap_mozgas:
  title: Összes munkalap mozgás
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
    - field: hova
      headerName: Hova
      enableRowGroup: true
    - field: datum
      headerName: Dátum
    - headerName: Nap
      valueGetter: data.datum.substring(0,10)
      enableRowGroup: true
    - field: db
      headerName: db
      type: numericColumn
      aggFunc: sum
    - field: ertek
      headerName: Érték
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: rendelt_perc
      headerName: Területen perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: ugyfelnev
      headerName: Megrendelő
      enableRowGroup: true
  mssql: >-
    ${sql.HelyekGepRelTable}
    SELECT * FROM ${sql.rendeleskartonmozgasView2} AS mozgas
    WHERE {where}
    ORDER BY datum
  where:
    - label: Ma
      value: datum >= ${sql._0napja}
    - label: 1 napja
      value: datum >= ${sql._1napja}
    - label: 2 napja
      value: datum >= ${sql._2napja}
    - label: 3 napja
      value: datum >= ${sql._3napja}
    - label: 7 napja
      value: datum >= ${sql._7napja}
    - label: 14 napja
      value: datum >= ${sql._14napja}
    - label: 30 napja
      value: datum >= ${sql._30napja}
    - label: 60 napja
      value: datum >= ${sql._60napja}
    - label: Nyitott
      value: statusz = 'N'

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
  // console.log(configYaml)
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
