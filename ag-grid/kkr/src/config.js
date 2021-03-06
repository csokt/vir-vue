import sql from './sql'
import yaml from 'js-yaml'

let configYaml = `

anchors:
  percentCellRenderer: &percentCellRenderer !!js/function >
    function (params) {
      var value = params.value !== null ? params.value.toFixed(1) : ''

      var eDivPercentBar = document.createElement('div')
      eDivPercentBar.className = 'div-percent-bar'
      eDivPercentBar.style.width = value + '%'
      if (value < 50) {
        eDivPercentBar.style.backgroundColor = '#F44336'
      } else if (value < 80) {
        eDivPercentBar.style.backgroundColor = '#FF9100'
      } else {
        eDivPercentBar.style.backgroundColor = '#4CAF50'
      }

      var eValue = document.createElement('div')
      eValue.className = 'div-percent-value'
      eValue.innerHTML = value ? value + '%' : value

      var eOuterDiv = document.createElement('div')
      eOuterDiv.className = 'div-outer-div'
      eOuterDiv.appendChild(eDivPercentBar)
      eOuterDiv.appendChild(eValue)

      return eOuterDiv
    }

  triStateCellStyle: &triStateCellStyle !!js/function >
    function(params) {
      if (params.value < 0.0) {
        return { backgroundColor: '#F44336'}
      } else if (params.value > 0.0) {
        return { backgroundColor: '#4CAF50'}
      } else {
        return null
      }
    }

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
    - { headerName: Törzsadatok,        field: torzs }
    - { headerName: Rendelések,         field: rendeles }
    - { headerName: Munkalap,           field: munkalap }
    - { headerName: Tervezés,           field: tervezes }
    - { headerName: Logisztika,         field: logisztika }
    - { headerName: Kötöde,             field: kotode }
    - { headerName: Varroda,            field: varroda }

  menu:
    torzs:
      - { value: Ügyfelek,              path: ugyfelek }
      - { value: Cikktörzs,             path: cikktorzs }
      - { value: Normák,                path: normak }
      - { value: Telephelyek,           path: telephelyek }
      - { value: Üzemek,                path: uzemek }
      - { value: Dolgozók,              path: dolgozok }
      - { value: Helyek,                path: helyek }
      - { value: Gépek,                 path: gepek }
      - { value: Hely-gép kapcsolat,    path: helyek_gep_rel }
    rendeles:
      - { value: Rendelésfej,           path: rendelesfej }
      - { value: Rendeléssor,           path: rendelessor }
    munkalap:
      - { value: E-H-U,                 path: ehu_munkalap }
      - { value: Kellék,                path: kellek_munkalap }
      - { value: Összes,                path: osszes_munkalap }
      - { value: E-H-U mozgás,          path: ehu_munkalap_mozgas }
      - { value: Kellék mozgás,         path: kellek_munkalap_mozgas }
      - { value: Összes mozgás,         path: osszes_munkalap_mozgas }
      # - { value: Adatok frissítése,   path: mssql_munkalap_update }
    tervezes:
      - { value: Kapacitásigény,        path: kapacitasigeny }
      - { value: Kapacitásigény2,       path: kapacitasigeny2 }
    logisztika:
      - { value: '-',                   path: xxx }
      # - { value: 'Teszt',               path: teszt }
    kotode:
      - { value: 'Kötőgép értékelés',   path: kotogep_ertekeles }
      - { value: 'Kötőgép értékelés2',  path: kotogep_ertekeles2 }
      - { value: 'Kötőgépek',           path: kotogep }
      - { value: 'Kötőgép log',         path: kotogep_log }
      - { value: 'Kötőgép kódolás',     path: kotogep_kodolas }
    varroda:
      - { value: '-',                   path: varroda_leadas }


###############################################################################################################################################################
teszt:
  title: Teszt
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
  pipe:
    - type: inject
      payload: SELECT * FROM ${sql.uzemek} AS uzemek WHERE {where} AND telephelykod >= {minhelykod} AND telephelykod <= {maxhelykod}
    - type: replacewhere
    - type: function
      code: !!js/function >
        function (msg) {
          msg.params = {minhelykod: 1, maxhelykod: 2}
        }
    - type: replaceparams
    - type: logpayload
    - type: apicall
      api: tir/call
  mssql: SELECT * FROM telephelyek
  alasql: SELECT uzemek.*, telephelyek.telephely FROM ? AS uzemek JOIN ? AS telephelyek ON uzemek.telephelykod = telephelyek.telephelykod
  where:
    - label: U üzemtípus
      value: uzemtipus != 'XU'

###############################################################################################################################################################
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
  mssql: SELECT * FROM ${sql.cikktorzsView} AS cikktorzs WHERE {where} ORDER BY cikkszam

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
  where: &munkalap_mozgas_where
    - label: Ma
      value: datum >= ${sql.ms_0napja}
    - label: 1 napja
      value: datum >= ${sql.ms_1napja}
    - label: 2 napja
      value: datum >= ${sql.ms_2napja}
    - label: 3 napja
      value: datum >= ${sql.ms_3napja}
    - label: 7 napja
      value: datum >= ${sql.ms_7napja}
    - label: 14 napja
      value: datum >= ${sql.ms_14napja}
    - label: 30 napja
      value: datum >= ${sql.ms_30napja}
    - label: 60 napja
      value: datum >= ${sql.ms_60napja}
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
  where: *munkalap_mozgas_where

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
  where: *munkalap_mozgas_where

###############################################################################################################################################################
kotogep:
  title: Kötőgépek
  defaultColDef:
    filter: true
  columnDefs:
    - field: name
      headerName: Név
    - field: aktiv
      headerName: Aktív?
    - field: azonosito
      headerName: Azonosító
    - field: tipus
      headerName: Típus
    - field: finomsag
      headerName: Finomság
    - field: uzem
      headerName: Üzem
    - field: sor
      headerName: Sor
    - field: allapot
      headerName: Állapot
    - field: jelzes
      headerName: Jelzés
  pgraktar: SELECT * FROM kotode_kotogep ORDER BY name

###############################################################################################################################################################
kotogep_log:
  title: Kötőgép log
  sideBar: true
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
  columnDefs:
    - field: jelzes
      headerName: Jelzés
      enableRowGroup: true
      enablePivot: true
      pivot: true
    - field: datumstr
      headerName: Dátum
    - field: nap
      headerName: Nap
      valueGetter: data.datumstr.substring(0,10)
      enableRowGroup: true
    - field: uzem
      headerName: Üzem
    - field: gepazonosito
      headerName: Gép azon.
      enableRowGroup: true
    - field: gep
      headerName: Gép
      enableRowGroup: true
    - field: muszak
      headerName: Műszak
      enableRowGroup: true
      enablePivot: true
    - field: idotartam
      headerName: Időtartam mp
      type: numericColumn
      aggFunc: sum
    - field: idotartam_perc
      headerName: Időtartam perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: idotartam_ora
      headerName: Időtartam óra
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      aggFunc: sum
    - field: megjegyzes
      headerName: Megjegyzés
  pgraktar: >-
    SELECT log.*, (datum AT TIME ZONE 'UTC')::CHAR(19) AS datumstr, megj.name AS megjegyzes
    FROM kotode_kotogep_log AS log
    LEFT JOIN kotode_megjegyzes AS megj ON megj.id = log.megjegyzes_id
    WHERE {where} ORDER BY id
  where:
    - label: Ma
      value: datum >= ${sql.pg_0napja}
    - label: 1 napja
      value: datum >= ${sql.pg_1napja} AND datum < ${sql.pg_0napja}
    - label: 2 napja
      value: datum >= ${sql.pg_2napja} AND datum < ${sql.pg_0napja}
    - label: 3 napja
      value: datum >= ${sql.pg_3napja} AND datum < ${sql.pg_0napja}
    - label: 7 napja
      value: datum >= ${sql.pg_7napja} AND datum < ${sql.pg_0napja}
    - label: 14 napja
      value: datum >= ${sql.pg_14napja} AND datum < ${sql.pg_0napja}
    - label: Elmúlt hét
      value: datum >= ${sql.pg_1hete} AND datum < ${sql.pg_0hete}
    - label: Elmúlt 2 hét
      value: datum >= ${sql.pg_2hete} AND datum < ${sql.pg_0hete}

###############################################################################################################################################################
kotogep_ertekeles: &kotogep_ertekeles
  title: Kötőgép értékelés
  sideBar: true
  domLayout: print
  # rowClass: row-class-header
  rowClassRules: {'row-class-header': 'data.gepprefix === "0"'}
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
  columnDefs:
    - field: nap
      headerName: Nap
    - field: gep
      headerName: Gép
      enableRowGroup: true
    - field: all
      headerName: Áll
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: hiba
      headerName: Hiba
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: ki
      headerName: Kikapcs.
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: termel
      headerName: Termel
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: ora
      headerName: Össz.
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: uzemeltetes
      headerName: Üzemeltetési teljesítmény
      valueGetter: "(data.ora-data.ki) ? 100*data.termel/(data.ora-data.ki) : null"
      # type: numericColumn
      # valueFormatter: "value ? value.toFixed(1) : value"
      cellRenderer: *percentCellRenderer
    - field: kihasznaltsag
      headerName: Gép teljesítmény (24 óra)
      valueGetter: "100*data.termel/(data.szamlal*24)"
      # type: numericColumn
      # valueFormatter: "value ? value.toFixed(1) : value"
      cellRenderer: *percentCellRenderer
  pgraktar: >-
    WITH
      log AS (
        SELECT (log.datum AT TIME ZONE 'UTC')::CHAR(10) AS nap, log.gep, log.jelzes, log.idotartam_ora
        FROM kotode_kotogep_log AS log
        LEFT JOIN kotode_kotogep AS gep ON gep.id = log.kotogep_id
        WHERE (log.uzem = 'sik' AND log.megjegyzes_id IS NULL AND gep.aktiv) AND {where}
      ),
      group_nap_gep_jelzes AS (
        SELECT nap, gep, jelzes, SUM(idotartam_ora) AS ora FROM log GROUP BY nap, gep, jelzes
      ),
      group_nap_gep AS (
        SELECT  nap, gep, 1 AS szamlal, SUM(idotartam_ora) AS ora FROM log GROUP BY nap, gep
      ),
      pivot_nap_gep AS (
        SELECT ''::CHAR AS napprefix, ''::CHAR AS gepprefix, group_nap_gep.nap, group_nap_gep.gep,
          group_nap_gep.szamlal, group_nap_gep.ora, group_all.ora AS all, group_hiba.ora AS hiba, group_ki.ora AS ki, group_termel.ora AS termel
        FROM group_nap_gep
        LEFT JOIN group_nap_gep_jelzes AS group_all ON group_all.nap = group_nap_gep.nap AND group_all.gep = group_nap_gep.gep AND group_all.jelzes = 'all'
        LEFT JOIN group_nap_gep_jelzes AS group_hiba ON group_hiba.nap = group_nap_gep.nap AND group_hiba.gep = group_nap_gep.gep AND group_hiba.jelzes = 'hiba'
        LEFT JOIN group_nap_gep_jelzes AS group_ki ON group_ki.nap = group_nap_gep.nap AND group_ki.gep = group_nap_gep.gep AND group_ki.jelzes = 'ki'
        LEFT JOIN group_nap_gep_jelzes AS group_termel ON group_termel.nap = group_nap_gep.nap AND group_termel.gep = group_nap_gep.gep AND group_termel.jelzes = 'termel'
      ),
      pivot_nap AS (
        SELECT ''::CHAR AS napprefix, '0'::CHAR AS gepprefix, nap, 'össz.'::VARCHAR AS gep,
          SUM(szamlal) AS szamlal, SUM(ora) AS ora, SUM("all") AS all, SUM(hiba) AS hiba, SUM(ki) AS ki, SUM(termel) AS termel
        FROM pivot_nap_gep GROUP BY nap
      ),
      pivot_osszes AS (
        SELECT '0'::CHAR AS napprefix, '0'::CHAR AS gepprefix, 'Összesen'::VARCHAR AS nap, ''::VARCHAR AS gep,
          SUM(szamlal) AS szamlal, SUM(ora) AS ora, SUM("all") AS all, SUM(hiba) AS hiba, SUM(ki) AS ki, SUM(termel) AS termel
        FROM pivot_nap_gep
      ),
      pivot AS (
        SELECT * FROM pivot_nap_gep UNION ALL SELECT * FROM pivot_nap UNION ALL SELECT * FROM pivot_osszes
      )
    SELECT * FROM pivot ORDER BY napprefix || nap, gepprefix || gep
  where:
    - label: Elmúlt hét
      value: datum >= ${sql.pg_1hete} AND datum < ${sql.pg_0hete}
    - label: Elmúlt 2 hét
      value: datum >= ${sql.pg_2hete} AND datum < ${sql.pg_0hete}
    - label: Elmúlt 4 hét
      value: datum >= ${sql.pg_4hete} AND datum < ${sql.pg_0hete}
    - label: Elmúlt hónap
      value: datum >= ${sql.pg_1honapja} AND datum < ${sql.pg_0honapja}
    - label: Elmúlt 2 hónap
      value: datum >= ${sql.pg_2honapja} AND datum < ${sql.pg_0honapja}
    - label: Elmúlt 3 hónap
      value: datum >= ${sql.pg_3honapja} AND datum < ${sql.pg_0honapja}
    - label: Ma
      value: datum >= ${sql.pg_0napja}
    - label: 1 napja
      value: datum >= ${sql.pg_1napja} AND datum < ${sql.pg_0napja}
    - label: 2 napja
      value: datum >= ${sql.pg_2napja} AND datum < ${sql.pg_0napja}
    - label: 3 napja
      value: datum >= ${sql.pg_3napja} AND datum < ${sql.pg_0napja}
    - label: 7 napja
      value: datum >= ${sql.pg_7napja} AND datum < ${sql.pg_0napja}
    - label: 14 napja
      value: datum >= ${sql.pg_14napja} AND datum < ${sql.pg_0napja}
    - label: 30 napja
      value: datum >= ${sql.pg_30napja} AND datum < ${sql.pg_0napja}
    - label: 60 napja
      value: datum >= ${sql.pg_60napja} AND datum < ${sql.pg_0napja}

###############################################################################################################################################################
kotogep_ertekeles2:
  <<: *kotogep_ertekeles
  title: Kötőgép értékelés2
  columnDefs:
    - field: nap
      headerName: Nap
    - field: gep
      headerName: Gép
      enableRowGroup: true
    - field: termel
      headerName: Termelt óra
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: kodolt_ora
      headerName: Kódolt óra
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: elter_ora
      headerName: Eltérés óra
      # valueGetter: "(data.kodolt_ora ? data.kodolt_ora : 0.0) - (data.termel ? data.termel : 0.0)"
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
      cellClassRules: { 'background-green': 'x > 0.0', 'background-red': 'x < 0.0' }
  function: !!js/function >
    function (msg) {
      if (msg.payload.length) {
        msg.params = {mindatum: msg.payload[1].nap, maxdatum: msg.payload.slice(-1)[0].nap}
      } else {
        msg.error = true
        console.log(JSON.parse(JSON.stringify(msg)))
      }
    }
  pipe:
    - type: inject
      payload: >-
        WITH
          kodol AS (
            SELECT CONVERT(CHAR(10), kodol.accessdate, 126) AS nap, kotogepek.megnevezes AS gep, kodol.darab * normak.normaperc / 60.0 AS ora
            FROM rendelesmatrica AS kodol
            JOIN kotogepek ON kotogepek.kotogepkod = kodol.gepkod
            JOIN ${sql.normak} AS normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
            WHERE kodol.muveletkod > 900 AND kodol.muveletkod < 960 AND kodol.darab > 0 AND kodol.accessdate >= '{mindatum}' AND kodol.accessdate < dateadd(day,1,'{maxdatum}')
          )
        SELECT nap, gep, SUM(ora) AS ora FROM kodol GROUP BY nap, gep
    - type: replaceparams
    - type: logpayload
    - type: apicall
      api: tir/call

    - type: function
      code: !!js/function >
        function (msg) {
          const pivot_nap_gep = msg.alasql("SELECT ms.* FROM ? AS pg JOIN ? AS ms ON ms.nap = pg.nap AND ms.gep = pg.gep", msg.payloadArray)
          const pivot_nap     = msg.alasql("SELECT nap, 'össz.' AS gep, SUM(ora) AS ora FROM ? GROUP BY nap", [pivot_nap_gep])
          const pivot_osszes  = msg.alasql("SELECT 'Összesen' AS nap, '' AS gep, SUM(ora) AS ora FROM ?", [pivot_nap_gep])
          msg.payloadArray[1] = [...pivot_nap_gep, ...pivot_nap, ...pivot_osszes]
        }
  alasql: SELECT pg.*, ms.ora AS kodolt_ora, COALESCE(ms.ora, 0.0) - COALESCE(pg.termel, 0.0) AS elter_ora FROM ? AS pg LEFT JOIN ? AS ms ON ms.nap = pg.nap AND ms.gep = pg.gep

###############################################################################################################################################################
kotogep_kodolas:
  title: Kötőgép kódolás
  sideBar: true
  #rowSelection: multiple
  defaultColDef:
    filter: true
    sortable: true
    resizable: true
  columnDefs:
    - field: kategoria
      headerName: Kötöde
      enableRowGroup: true
      enablePivot: true
    - field: nap
      headerName: Nap
      enableRowGroup: true
      enablePivot: true
    - field: datum
      headerName: Dátum
    - field: megnevezes
      headerName: Kötőgép
      enableRowGroup: true
      enablePivot: true
    - field: cikkszam
      headerName: Cikkszám
      enableRowGroup: true
      enablePivot: true
    - field: vonalkod
      headerName: Munkalap
      enableRowGroup: true
      enablePivot: true
      cellStyle: {'background-color': 'beige'}
    - field: muveletkod
      headerName: Műveletkod
      enableRowGroup: true
      enablePivot: true
    - field: darab
      headerName: Darab
      type: numericColumn
    - field: normaperc
      headerName: Normaperc
      type: numericColumn
    - field: perc
      headerName: Kódolt perc
      type: numericColumn
      valueFormatter: "value ? value.toFixed(2) : value"
    - field: ora
      headerName: Kódolt óra
      type: numericColumn
      aggFunc: sum
      valueFormatter: "value ? value.toFixed(2) : value"
  onClick:
    vonalkod:
      path: osszes_munkalap
      where: munkalapazonosito='\${vonalkod}'
  mssql: >-
    SELECT kotogepek.kategoria, CONVERT(CHAR(10), kodol.accessdate, 126) AS nap, kodol.accessdate AS datum, kotogepek.megnevezes, kodol.cikkszam, kodol.vonalkod,
      kodol.muveletkod, kodol.darab, normak.normaperc, kodol.darab * normak.normaperc AS perc, kodol.darab * normak.normaperc / 60.0 AS ora
    FROM rendelesmatrica AS kodol
    JOIN kotogepek ON kotogepek.kotogepkod = kodol.gepkod
    JOIN ${sql.normak} AS normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
    WHERE kodol.muveletkod > 900 AND kodol.muveletkod < 960 AND kodol.darab > 0 AND {where}
    ORDER BY datum
  where:
    - label: Ma
      value: kodol.accessdate >= ${sql.ms_0napja}
    - label: 1 napja
      value: kodol.accessdate >= ${sql.ms_1napja}
    - label: 2 napja
      value: kodol.accessdate >= ${sql.ms_2napja}
    - label: 3 napja
      value: kodol.accessdate >= ${sql.ms_3napja}
    - label: 7 napja
      value: kodol.accessdate >= ${sql.ms_7napja}
    - label: 14 napja
      value: kodol.accessdate >= ${sql.ms_14napja}
    - label: 30 napja
      value: kodol.accessdate >= ${sql.ms_30napja}
    - label: 60 napja
      value: kodol.accessdate >= ${sql.ms_60napja}
`

let Config = null
try {
  // console.log(configYaml)
  // Config = yaml.safeLoad(configYaml)
  Config = yaml.load(configYaml)
  // console.log(Config)
  for (const gridkey in Config) {
    let grid = Config[gridkey]
    let pipe = []
    for (const key in grid) {
      if (['mssql', 'pgraktar'].includes(key)) {
        pipe.push({ type: 'inject', payload: grid[key] })
        pipe.push({ type: 'replacewhere' })
        pipe.push({ type: 'logpayload' })
      }
      switch (key) {
        case 'mssql':
          pipe.push({ type: 'apicall', api: 'tir/call' })
          break
        case 'pgraktar':
          pipe.push({ type: 'apicall', api: 'vir/raktarcall' })
          break
        case 'alasql':
          pipe.push({ type: 'inject', payload: grid[key] })
          pipe.push({ type: 'alasql' })
          break
        case 'function':
          pipe.push({ type: 'function', code: grid[key] })
          break
        case 'pipe':
          pipe.push(...grid[key])
          break
        case 'logpayload':
          pipe.push({ type: 'logpayload' })
          break
        case 'logmsg':
          pipe.push({ type: 'logmsg' })
          break
        case 'logpipe':
          pipe.push({ type: 'logpipe' })
          break
      }
    }
    if (pipe.length) {
      grid.pipe = pipe
    }
  }
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
  Config.localeText = sql.localeText
  // console.log(Config)
} catch (err) {
  console.log(err)
}

export default Config
