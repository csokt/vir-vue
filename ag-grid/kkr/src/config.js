import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  title: Kötöttáru kontrolling rendszer
  columnDefs:
  - field: szefo
    headerName: SZEFO
  - field: logisztika
    headerName: Logisztika
  - field: kotode
    headerName: Kötöde
  - field: varroda
    headerName: Varroda
  menu:
    szefo:
    - value:  Üzemek
      path:   uzemek
    - value:  Telephelyek
      path:   telephelyek
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
