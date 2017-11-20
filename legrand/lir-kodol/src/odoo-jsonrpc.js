var odooJsonrpc = (function () {
  let internal = {
    request_counts: 0,
    session_id: '',
    host: ''
  }

  let exposed = {}

  /**
   * Send a request to Odoo server
   *
   * @param string url the path to call
   * @param object params the params to send in the request
   * @return Promise
   */
  internal.sendRequest = function (url, params) {
    return new Promise(function (resolve, reject) {
      // the data to send
      let jsonData = {
        jsonrpc: '2.0',
        method: 'call',
        params: params,
        'id': 'r' + internal.request_counts
      }

      // create a new asynchronous request
      let request = new XMLHttpRequest()
      request.open('POST', internal.host + url, true)

      // Define the content type : JSON-RPC -> application/json
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      request.overrideMimeType('application/json')

      // If a session_id exist, set it in the request
      if (internal.session_id) {
        jsonData.session_id = internal.session_id
        request.withCredentials = true
      }

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          switch (request.status) {
            case 200:
            case 201:
              try {
                // Parse the response of request
                let data = JSON.parse(request.responseText)

                // Odoo result contains a error param if the request failed
                if ('error' in data) {
                  reject(data.error)
                  return
                }

                // Odoo result must contains a result param if the request success
                if (('result' in data) === false) {
                  reject(Error('no result in data received'))
                  return
                }

                // login specifical process
                if (/\/web\/session\/authenticate$/.test(request.responseURL) === true) {
                  // if uid is false, login fail : bad login or password
                  if (data.result.uid !== false) {
                    internal.session_id = data.result.session_id
                  } else {
                    reject(Error('Fail to login in database'))
                  }
                }

                // Resolve promise
                resolve(data.result)
              } catch (e) {
                reject(Error('Odoo Exception : ' + e.message))
                return
              }
              break

            default:
              reject(Error('Fail to get ' + url))
          }
        }
      }

      // send the request
      request.send(JSON.stringify(jsonData))

      // increment the request count
      internal.request_counts += 1
    })
  }

  /**
   * Define the host where Odoo is
   *
   * @param string host the odoo's host
   * @return odooJsonrpc
   */
  exposed.setHost = function (host) {
    // check scheme
//    if (/^https?:\/\//.test(host) === false) {
//      host = 'http://' + host
//    }

    internal.host = host
    return exposed
  }

  /**
   * Login into Odoo
   *
   * @param string db the database
   * @param string username the username of the user which try to connect
   * @param string password the password of the user which try to connect
   * @return Promise
   */
  exposed.login = function (db, login, password) {
    return internal.sendRequest('/web/session/authenticate', {
      db: db,
      login: login,
      password: password
    })
  }

  // /////////////////////////////////////////////////////////////////////////
  //
  //                              Database methods
  //
  // /////////////////////////////////////////////////////////////////////////
  exposed.database = {}

  /**
   * List all databases availables
   *
   * @return Promise
   */
  exposed.database.list = function () {
    return internal.sendRequest('/web/database/get_list')
  }

  /**
   * Create a new database
   *
   * @param string name the name of the database to create
   * @param string masterPassword the master password of odoo (in the config file)
   * @param bool demo populate with demo data or not
   * @param string language language to use
   * @param string adminPassword admin password to initialize
   * @return Promise
   */
  exposed.database.create = function (name, masterPassword, demo, language, adminPassword) {
    return internal.sendRequest('/web/database/create', {
      fields: [
        {name: 'super_admin_pwd', value: masterPassword},
        {name: 'db_name', value: name},
        {name: 'demo_data', value: demo},
        {name: 'db_lang', value: language},
        {name: 'create_admin_pwd', value: adminPassword}
      ]
    })
  }

  /**
   * Create a new database
   *
   * @param string sourceName the name of the database to duplicate
   * @param string destinationName the name of the database to create
   * @param string masterPassword the master password of odoo (in the config file)
   * @return Promise
   */
  exposed.database.duplicate = function (sourceName, destinationName, masterPassword) {
    return internal.sendRequest('/web/database/duplicate', {
      fields: [
        {name: 'super_admin_pwd', value: masterPassword},
        {name: 'db_original_name', value: sourceName},
        {name: 'db_name', value: destinationName}
      ]
    })
  }

  /**
   * Create a new database
   *
   * @param string name the name of the database to drop
   * @param string masterPassword the master password of odoo (in the config file)
   * @return Promise
   */
  exposed.database.drop = function (name, masterPassword) {
    return internal.sendRequest('/web/database/drop', {
      fields: [
        {name: 'drop_pwd', value: masterPassword},
        {name: 'drop_db', value: name}
      ]
    })
  }

  // /////////////////////////////////////////////////////////////////////////
  //
  //                              Session methods
  //
  // /////////////////////////////////////////////////////////////////////////
  exposed.session = {}

  /**
   * Get all informations about session
   *
   * @return Promise
   */
  exposed.session.getInfos = function () {
    return internal.sendRequest('/web/session/get_session_info')
  }

  /**
   * Get all informations about session
   *
   * @return Promise
   */
  exposed.session.changePassword = function (oldPassword, newPassword) {
    return internal.sendRequest('/web/session/change_password', {
      fields: [
        {name: 'old_pwd', value: oldPassword},
        {name: 'new_password', value: newPassword},
        {name: 'confirm_pwd', value: newPassword}
      ]
    })
  }

  /**
   * Get the list of availables languages
   *
   * @return Promise
   */
  exposed.session.getLanguages = function () {
    return internal.sendRequest('/web/session/get_lang_list')
  }

  /**
   * Get the list of availables modules
   *
   * @return Promise
   */
  exposed.session.getModules = function () {
    return internal.sendRequest('/web/session/modules')
  }

  // /////////////////////////////////////////////////////////////////////////
  //
  //                              Model methods
  //
  // /////////////////////////////////////////////////////////////////////////
  exposed.model = {}

  /**
   * Search and read into a model
   *
   * @param string model the odoo model where the search must be processed
   * @param array domain the criteria of the search
   * @param array fields the fields to read
   * @return Promise
   */
  exposed.model.searchRead = function (model, domain, fields = [], limit = null, sort = null, offset = null) {
    const params = {
      model: model,
      domain: domain,
      fields: fields,
      limit: limit,
      sort: sort,
      offset: offset
    }

    return internal.sendRequest('/web/dataset/search_read', params)
  }

  /**
   * Find a record into a model by id
   *
   * @param string model the odoo model where the search must be processed
   * @param int id the id search
   * @param array fields the fields to read
   * @return Promise
   */
  exposed.model.find = function (model, id, fields) {
    return new Promise(function (resolve, reject) {
      let domain = [['id', '=', id]]

      exposed.model.searchRead(model, domain, fields).then(
        function (result) {
          if (result.length) {
            resolve(result.records[0])
          } else {
            resolve(null)
          }
        },
        function (error) {
          reject(error)
        }
      )
    })
  }

  /**
   * Call a custom method in Odoo
   *
   * @param string model the odoo model where the call must be processed
   * @param string method the method to call
   * @param array args the args
   * @param array kwargs the kwargs
   * @return Promise
   */
  exposed.model.call = function (model, method, args, kwargs) {
    if (undefined === args) {
      args = {}
    }

    if (undefined === kwargs) {
      kwargs = {}
    }

    const params = {
      model: model,
      method: method,
      args: args,
      kwargs: kwargs
    }

    return internal.sendRequest('/web/dataset/call_kw', params)
  }

  /**
   * Create a new record in Odoo
   *
   * @param string model the odoo model where the record must be inserted
   * @param array datas the datas to insert
   * @return Promise
   */
  exposed.model.create = function (model, datas) {
    return exposed.model.call(model, 'create', [datas])
  }

  /**
   * Update a record in Odoo
   *
   * @param string model the odoo model where the record must be updated
   * @param int id the id to update
   * @param array datas the datas to insert
   * @return Promise
   */
  exposed.model.write = function (model, id, datas) {
    return exposed.model.call(model, 'write', [id, datas])
  }

  /**
   * Delete a record in Odoo
   *
   * @param string model the odoo model where the record must be deleted
   * @param int id the id to deleted
   * @return Promise
   */
  exposed.model.remove = function (model, id) {
    return exposed.model.call(model, 'unlink', [[id]])
  }

  return exposed
}())

export default odooJsonrpc
