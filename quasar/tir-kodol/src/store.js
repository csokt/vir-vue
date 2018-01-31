let Store = {
  user: null,
  kodol: null,
  kodolasok: [],
  menthet: true,

  model: {
    id: 1,
    name: 'John Doe'
  },

  schema: {
    fields: [{
      type: 'input',
      inputType: 'text',
      label: 'ID (disabled text field)',
      model: 'id',
      readonly: true,
      disabled: true
    }, {
      type: 'input',
      inputType: 'text',
      label: 'Name',
      model: 'name',
      placeholder: 'Your name',
      featured: true,
      required: true
    }]
  },

  userError: ''
}

export default Store
