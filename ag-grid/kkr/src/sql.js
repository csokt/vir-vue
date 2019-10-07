let sql = {}

// ############################################################################################################################  Expressions  ###
sql._0napja = 'dateadd(day,datediff(day,0,GETDATE()),0)'
sql._1napja = 'dateadd(day,datediff(day,1,GETDATE()),0)'
sql._2napja = 'dateadd(day,datediff(day,2,GETDATE()),0)'
sql._3napja = 'dateadd(day,datediff(day,3,GETDATE()),0)'
sql._7napja = 'dateadd(day,datediff(day,7,GETDATE()),0)'
sql._14napja = 'dateadd(day,datediff(day,14,GETDATE()),0)'
sql._30napja = 'dateadd(day,datediff(day,30,GETDATE()),0)'
sql._60napja = 'dateadd(day,datediff(day,60,GETDATE()),0)'

// ############################################################################################################################  Helyek - Gép  ###
sql.HelyekGepRelTable = `
    DECLARE @helyek_gep_rel TABLE (gepkod int, helykod int);
    INSERT INTO @helyek_gep_rel (gepkod, helykod) VALUES
      (2,38),(2,25),(2,35),(2,24),(3,25),(3,35),(3,38),(3,24),(4,25),(4,35),(4,24),(5,24),(5,25),(5,35),(5,38),(7,21),(7,26),(8,37),(9,37),(10,26),(11,21),(12,38),(13,38),(14,38),(15,38),(12,22),(13,22),(14,22),(15,22),(16,24),(16,25),(16,38),(16,35),(17,24),(18,24),(18,35),(17,38),(18,25),(19,35),(19,38),(19,25),(19,24),(20,25),(20,38),(20,21),(20,35),(20,26),(21,24),(22,38),(22,24),(22,25),(22,35),(24,25),(24,38),(24,24),(24,35),(25,38),(25,22),(26,22),(26,38),(26,23),(27,25),(27,38),(27,24),(30,33),(31,38),(31,22),(34,33),(36,30),(38,26)
      ;`

sql.helyek_gep_rel_view = `
    (
      SELECT helyek.*, gep.* FROM @helyek_gep_rel AS rel
      JOIN gep ON gep.gepkod = rel.gepkod
      JOIN helyek ON helyek.azon = rel.helykod
    )`

// ############################################################################################################################  Ügyfél  ###
sql.ugyfel = `
    (
      SELECT ugyfel.* FROM ugyfel
      JOIN (SELECT DISTINCT partnerkod FROM rendelesfej) AS ugyfel_ids ON ugyfel_ids.partnerkod = ugyfel.ugyfelkod
      WHERE ugyfel.aktiv = 'A'
    )`

// ############################################################################################################################  Cikktörzs  ###
sql.cikktorzs = `(SELECT * FROM cikktorzs WHERE aktiv = 'A')`

sql.cikktorzsView = `
    (
      SELECT cikkhsz, tcikkszam AS cikkszam, markanev, partnercikk, nev AS cikknev, eladasiar, elfogadottar, ugyfelkod, ugyfelnev
      FROM ${sql.cikktorzs} AS cikktorzs
    )`

// ############################################################################################################################  Rendelésfej  ###
sql.rendelesfej = `(SELECT * FROM rendelesfej WHERE statusz != 'T')`

sql.cikkekGyartasAlatt = `(SELECT DISTINCT cikkszam FROM rendelesfej WHERE statusz = 'N')`

sql.rendelesfejGroupByPartnerkod = `
    (
      SELECT partnerkod, SUM(mennyiseg) AS mennyiseg, SUM(nemgyarthatodb) AS nemgyarthatodb, SUM(sumkotesrevar) AS sumkotesrevar,
        SUM(sumlekotve) AS sumlekotve, SUM(sumkiszallitva) AS sumkiszallitva, SUM(sumszamlazva) AS sumszamlazva
      FROM ${sql.rendelesfej} AS fej
      GROUP BY partnerkod
    )`

// ############################################################################################################################  Üzemek  ###
sql.uzemek = `(SELECT * FROM uzemek WHERE statusz = 'A')`

sql.uzemekView = `
    (
      SELECT uzemek.*, telephelyek.telephely
      FROM ${sql.uzemek} AS uzemek
      JOIN telephelyek ON uzemek.telephelykod = telephelyek.telephelykod
    )`

// ############################################################################################################################  Dolgtr  ###
sql.dolgtr = `(SELECT * FROM dolgtr WHERE aktiv = 'A')`

sql.dolgtrView = `
    (
      SELECT dolgtr.dolgozokod, dolgtr.dolgozonev, uzemek.*
      FROM dolgtr
      JOIN ${sql.uzemekView} AS uzemek ON dolgtr.uzemkod = uzemek.uzemkod
      WHERE dolgtr.aktiv = 'A'
    )`

// ############################################################################################################################  Gép  ###
sql.gep = `(SELECT * FROM gep WHERE statusz = 'A')`

// ############################################################################################################################  Normák  ###
sql.normak = `(SELECT * FROM normak WHERE normaperc > 0.01)`

sql.normakView = `
    (
      SELECT normak.cikkszam, nyitott.cikkszam AS nyitott_cikkszam, CAST(normak.muveletkod AS int) AS muveletkod, normak.muveletnev,
        normak.elokeszito, normak.kellek, normak.normaperc, normak.gepkod, normak.felszabaditas, normak.bontaskod, gep.gepnev
      FROM ${sql.normak} AS normak
      JOIN gep ON gep.gepkod = normak.gepkod
      LEFT JOIN ${sql.cikkekGyartasAlatt} AS nyitott ON nyitott.cikkszam = normak.cikkszam
    )`

sql.normakGroupByHelykodGepkodMuveletkod = `
    (
      SELECT
        normak.cikkszam, normak.elokeszito, rel.helykod, normak.gepkod, normak.muveletkod, SUM(normak.normaperc) AS sumperc
      FROM normak
      JOIN @helyek_gep_rel AS rel ON rel.gepkod = normak.gepkod
      WHERE normak.normaperc > 0.01 AND normak.kellek = 0
      GROUP BY normak.cikkszam, normak.elokeszito, rel.helykod, normak.gepkod, normak.muveletkod
    )`

sql.normakGroupByHelykod = `
    (
      SELECT
        normak.cikkszam, normak.elokeszito, rel.helykod, SUM(normak.normaperc) AS sumperc
      FROM ${sql.normak} AS normak
      JOIN @helyek_gep_rel AS rel ON rel.gepkod = normak.gepkod
      WHERE normak.kellek = 0
      GROUP BY normak.cikkszam, normak.elokeszito, rel.helykod
    )`

// ############################################################################################################################  Rendelésmatrica  ###
sql.rendelesmatricaView = `
    (
      SELECT matricakod, mlap.munkalapazonosito, normak.muveletkod
      FROM rendelesmatrica AS kodol
      JOIN rendelesmunkalap AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
      JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
    )`

sql.kodolGroupByMunkalap = `
    (
      SELECT vonalkod AS munkalapazonosito, SUM(darab * normaperdb) AS sumperc
      FROM rendelesmatrica
      GROUP BY vonalkod
    )`

// ############################################################################################################################  Rendelésmunkalap  ###
sql.rendelesmunkalap = `(SELECT *, CASE LEFT(munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AS elokeszito FROM rendelesmunkalap WHERE db > 0)`

sql.rendelesmunkalapView = `
    (
      SELECT
        mlap.rendelesszam, mlap.partnerrendelesszam, mlap.itszam, mlap.utem, mlap.kartonszam, mlap.cikkszam, mlap.munkalapazonosito,
        mlap.szinkod, mlap.meret, mlap.meretsorrend, mlap.db, mlap.kellektipus, mlap.hely, mlap.elokeszito,
        fej.statusz,
        ugyfel.ugyfelkod, ugyfel.nev AS ugyfelnev,
        helyek.rhely AS helynev,
        CASE mlap.elokeszito WHEN 0 THEN mlap.db*fej.elfogadottar WHEN 1 THEN 0.0 END AS ertek,
        szotar.nev AS kellektipusnev
      FROM ${sql.rendelesmunkalap} AS mlap
      JOIN ${sql.rendelesfej} AS fej ON fej.rendelesszam = mlap.rendelesszam
      JOIN ${sql.ugyfel} AS ugyfel ON ugyfel.ugyfelkod = fej.partnerkod
      LEFT JOIN helyek ON helyek.azon = mlap.hely
      LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
    )`

sql.rendelesmunkalapView2 = `
    (
      SELECT
        mlap.*, mlap.db * norma.sumperc AS rendelt_perc
      FROM ${sql.rendelesmunkalapView} AS mlap
      LEFT JOIN ${sql.normakGroupByHelykod} AS norma
        ON norma.cikkszam = mlap.cikkszam AND norma.elokeszito = mlap.elokeszito AND norma.helykod = mlap.hely
    )`

sql.munkalapGroupByRendelesszamElokeszito = `
    (
      SELECT
        rendelesszam, elokeszito, COUNT(*) AS tetelszam
      FROM ${sql.rendelesmunkalap} AS mlap
      GROUP BY rendelesszam, elokeszito
    )`

// ############################################################################################################################  Rendeléskartonmozgás  ###
sql.rendeleskartonmozgasView = `
    (
      SELECT
        mlap.*, mozgas.hely AS hova_helykod, hova.rhely AS hova, mozgas.datum
      FROM rendeleskartonmozgas AS mozgas
      JOIN ${sql.rendelesmunkalapView} AS mlap ON mlap.munkalapazonosito = mozgas.munkalapazonosito
      JOIN helyek AS hova ON hova.azon = mozgas.hely
    )`

sql.rendeleskartonmozgasViewX = `
    (
      SELECT
        mlap.*, hova.rhely AS hova, mozgas.datum, mlap.db * norma.sumperc AS rendelt_perc
      FROM rendeleskartonmozgas AS mozgas
      JOIN ${sql.rendelesmunkalapView} AS mlap ON mlap.munkalapazonosito = mozgas.munkalapazonosito
      JOIN helyek AS hova ON hova.azon = mozgas.hely
      LEFT JOIN ${sql.normakGroupByHelykod} AS norma
        ON norma.cikkszam = mlap.cikkszam AND norma.elokeszito = mlap.elokeszito AND norma.helykod = mozgas.hely
    )`

sql.rendeleskartonmozgasView2 = `
    (
      SELECT
        mozgas.*, mozgas.db * norma.sumperc AS rendelt_perc
      FROM ${sql.rendeleskartonmozgasView} AS mozgas
      LEFT JOIN ${sql.normakGroupByHelykod} AS norma
        ON norma.cikkszam = mozgas.cikkszam AND norma.elokeszito = mozgas.elokeszito AND norma.helykod = mozgas.hova_helykod
    )`

export default sql
