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
    logisztika:
    - value:  Napi leadás
      path:   logisztika_leadas
    - value:  RAM
      path:   logisztika_ram
    kotode:
    - value:  Napi leadás
      path:   kotode_leadas
    varroda:
    - value:  Napi leadás
      path:   varroda_leadas
    - value:  NORAM
      path:   varroda_noram

  # menu:
  # -
  #   - field:  logisztika
  #     value:  Napi leadás
  #     path:   logisztika_leadas
  #   - field:  kotode
  #     value:  Napi leadás
  #     path:   kotode_leadas
  #   - field:  varroda
  #     value:  Napi leadás
  #     path:   varroda_leadas
  # -
  #   - field:  szefo
  #     value:  Üzemek
  #     path:   uzemek
  #   - field:  logisztika
  #     value:  RAM
  #     path:   logisztika_ram
  #   - field:  varroda
  #     value:  NORAM
  #     path:   varroda_ram

uzemek:
  title: Üzemek
  columnDefs:
  - field: uzemkod
    headerName: Üzemkód
  - field: uzemnev
    headerName: Üzemnév
  - field: vonalkod
    headerName: Vonalkód
  - field: uzemtipus
    headerName: Üzemtípus
  - field: statusz
    headerName: Státusz
  mssql: SELECT uzemkod, uzemnev, vonalkod, uzemtipus, statusz FROM uzemek

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
