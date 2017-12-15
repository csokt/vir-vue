const clientId = Math.random().toString(16).substr(2)

let Store = {
  requestBase: 'mssql/request/tir/kodol/' + clientId + '/',
  responseBase: 'mssql/response/tir/kodol/' + clientId + '/',
  user: null,
  kodol: null,
  kodolasok: [],

  userError: ''
}

export default Store
