import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
  - field: torzs
    headerName: Törzsadatok
  - field: tervezes
    headerName: Tervezés
  - field: munkalap
    headerName: Munkalap
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
    - value:  Üzemek
      path:   uzemek
    - value:  Telephelyek
      path:   telephelyek
    tervezes:
    - value:  "Gépkapacitás"
      path:   gepkapacitas
    munkalap:
    - value:  E-H-U
      path:   ehu_munkalap
    - value:  Kellék
      path:   kellek_munkalap
    - value:  "E-H-U mozgás"
      path:   ehu_munkalap_mozgas
    - value:  "Kellék mozgás"
      path:   kellek_munkalap_mozgas
    logisztika:
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

ugyfelek:
  title: Ügyfelek
  columnDefs:
  - field: ugyfelkod
    headerName: Ügyfélkód
  - field: ugyfelnev
    headerName: Ügyfélnév
  - field: rendelt
    headerName: Rendelt db
    type: numericColumn
  - field: kiszallitott
    headerName: Kiszállított db
    type: numericColumn
  - field: hatralek
    headerName: Hátralék db
    type: numericColumn
  mssql: >-
    WITH ugyfel_ids (partnerkod) AS (
        SELECT DISTINCT partnerkod FROM rendelesfej
        WHERE statusz = 'N'
    ),
        rendelt (partnerkod, mennyiseg) AS (
        SELECT partnerkod, SUM(mennyiseg) AS mennyiseg
        FROM rendelesfej AS fej
        WHERE fej.statusz = 'N'
        GROUP BY partnerkod
    ),
        kiszall (partnerkod, mennyiseg) AS (
        SELECT kiszall.partnerkod, SUM(kiszall.osszdb) AS mennyiseg
        FROM rendeleskiszallitas AS kiszall
        JOIN rendelesfej AS fej ON fej.rendelesszam = kiszall.rendelesszam
        WHERE kiszall.osszdb IS NOT NULL AND fej.statusz = 'N'
        GROUP BY kiszall.partnerkod
    )
    SELECT ugyfel.ugyfelkod, ugyfel.nev AS ugyfelnev, rendelt.mennyiseg AS rendelt,
        ISNULL(kiszall.mennyiseg,0) AS kiszallitott, rendelt.mennyiseg - ISNULL(kiszall.mennyiseg,0) AS hatralek
    FROM ugyfel
    JOIN ugyfel_ids ON ugyfel_ids.partnerkod = ugyfel.ugyfelkod AND ugyfel.aktiv = 'A'
    LEFT JOIN rendelt ON rendelt.partnerkod = ugyfel.ugyfelkod
    LEFT JOIN kiszall ON kiszall.partnerkod = ugyfel.ugyfelkod
    ORDER BY ugyfel.ugyfelkod

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

gepkapacitas:
  title: Gépkapacitás
  columnDefs:
  - field: gepkod
    headerName: Gépkódkód
    type: numericColumn
  - field: gepnev
    headerName: Gépnév
  - field: rendelt
    headerName: Rendelt perc
    type: numericColumn
  - field: kesz
    headerName: Kész perc
    type: numericColumn
  - field: hatralek
    headerName: Hátralék perc
    type: numericColumn
  mssql: >-
    WITH rendelt (gepkod, perc) AS (
        SELECT
            normak.gepkod,
            ROUND(SUM(fej.mennyiseg * normak.normaperc),0) AS perc
        FROM rendelesfej AS fej
        JOIN normak ON normak.cikkszam = fej.cikkszam
        WHERE fej.statusz = 'N'
        GROUP BY normak.gepkod
    ),
        kesz (gepkod, perc) AS (
        SELECT
            normak.gepkod,
            ROUND(SUM(kodol.darab * kodol.normaperdb),0) AS perc
        FROM rendelesmatrica AS kodol
        JOIN rendelesmunkalap AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
        JOIN rendelesfej AS fej ON fej.rendelesszam = mlap.rendelesszam
        JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
        WHERE mlap.db > 0 AND fej.statusz = 'N'
        GROUP BY normak.gepkod
    )
    SELECT
        gep.gepkod, gep.gepnev,
        ISNULL(rendelt.perc,0) AS rendelt,
        ISNULL(kesz.perc,0) AS kesz,
        ISNULL(rendelt.perc,0) - ISNULL(kesz.perc,0) AS hatralek
    FROM gep
    LEFT JOIN rendelt ON rendelt.gepkod = gep.gepkod
    LEFT JOIN kesz ON kesz.gepkod = gep.gepkod
    WHERE gep.statusz = 'A'
    ORDER BY gep.gepkod

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
    WHERE mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N'
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
    WHERE mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N'
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
    WHERE mlap.munkalapazonosito LIKE '2%' AND mlap.db > 0 AND fej.statusz = 'N'
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
    WHERE mlap.munkalapazonosito LIKE '4%' AND mlap.db > 0 AND fej.statusz = 'N'
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
