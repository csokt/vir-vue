import yaml from 'js-yaml'
var configYaml = `

kkrmenu:
  columnDefs:
  - field: logisztika
    headerName: Logisztika
  - field: kotode
    headerName: Kötöde
  - field: varroda
    headerName: Varroda
  menu:
  -
    - field:  logisztika
      value:  Napi leadás
      path:   logisztika_leadas
    - field:  kotode
      value:  Napi leadás
      path:   kotode_leadas
    - field:  varroda
      value:  Napi leadás
      path:   varroda_leadas
  -
    - field:  logisztika
      value:  RAM
      path:   logisztika_ram
    - field:  varroda
      value:  NORAM
      path:   varroda_ram

`

let Config = null
try {
  Config = yaml.safeLoad(configYaml)
} catch (err) {
  console.log(err)
}

export default Config
