let sql = {}

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

sql.normakGroupByCikkszamElokeszitoHelykodGepkodMuveletkodSumPerc = `
    (
      SELECT
        normak.cikkszam, normak.elokeszito, rel.helykod, normak.gepkod, normak.muveletkod, SUM(normak.normaperc) AS sumperc
      FROM normak
      JOIN @helyek_gep_rel AS rel ON rel.gepkod = normak.gepkod
      WHERE normak.normaperc > 0.01 AND normak.kellek = 0
      GROUP BY normak.cikkszam, normak.elokeszito, rel.helykod, normak.gepkod, normak.muveletkod
    )`

sql.normakGroupByCikkszamElokeszitoHelykodSumPerc = `
    (
      SELECT
        normak.cikkszam, normak.elokeszito, rel.helykod, SUM(normak.normaperc) AS sumperc
      FROM ${sql.normak} AS normak
      JOIN @helyek_gep_rel AS rel ON rel.gepkod = normak.gepkod
      WHERE normak.kellek = 0
      GROUP BY normak.cikkszam, normak.elokeszito, rel.helykod
    )`

// ############################################################################################################################  Rendelésmunkalap  ###
// sql.rendelesmunkalapKkr = `
//    (rendelesszam, partnerrendelesszam, itszam, utem, kartonszam, cikkszam, munkalapazonosito,
//      szinkod, meret, meretsorrend, db, kellektipus, hely, elokeszito, ugyfelnev, helynev, ertek, kellektipusnev) AS (
sql.rendelesmunkalap = `(SELECT *, CASE LEFT(munkalapazonosito, 1) WHEN '2' THEN 0 WHEN '4' THEN 1 END AS elokeszito FROM rendelesmunkalap WHERE db > 0)`

sql.rendelesmunkalapView = `
    (
      SELECT
        mlap.rendelesszam, mlap.partnerrendelesszam, mlap.itszam, mlap.utem, mlap.kartonszam, mlap.cikkszam, mlap.munkalapazonosito,
        mlap.szinkod, mlap.meret, mlap.meretsorrend, mlap.db, mlap.kellektipus, mlap.hely, mlap.elokeszito,
        fej.statusz,
        ugyfel.nev AS ugyfelnev,
        helyek.rhely AS helynev,
        mlap.db*fej.elfogadottar AS ertek,
        mlap.db*norma.sumperc AS rendelt_perc,
        szotar.nev AS kellektipusnev
      FROM ${sql.rendelesmunkalap} AS mlap
      JOIN ${sql.rendelesfej} AS fej ON fej.rendelesszam = mlap.rendelesszam
      JOIN ${sql.ugyfel} AS ugyfel ON ugyfel.ugyfelkod = fej.partnerkod
      LEFT JOIN helyek ON helyek.azon = mlap.hely
      LEFT JOIN SzefoModulParam.dbo.kodszotar AS szotar ON szotar.kod = mlap.kellektipus AND szotar.tipus = 'KELTIP'
      LEFT JOIN ${sql.normakGroupByCikkszamElokeszitoHelykodSumPerc} AS norma
        ON norma.cikkszam = mlap.cikkszam AND norma.elokeszito = mlap.elokeszito AND norma.helykod = mlap.hely
    )`

// sql.rendelesmunkaBase = `
//     (
//       SELECT matricakod, mlap.munkalapazonosito, normak.muveletkod
//       FROM rendelesmatrica AS kodol
//       JOIN ${rendelesmunkalapBase} AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
//       JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
//     )`

// sql.rendelesmatricaBase = `
//     (
//       SELECT matricakod, mlap.munkalapazonosito, normak.muveletkod
//       FROM rendelesmatrica AS kodol
//       JOIN ${rendelesmunkalapBase} AS mlap ON mlap.munkalapazonosito = kodol.vonalkod
//       JOIN normak ON normak.cikkszam = kodol.cikkszam AND normak.muveletkod = kodol.muveletkod
//     )`

export default sql
