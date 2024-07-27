/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset = {
  stock: '',
}
const stockRules = {
  rules: {
    stock: [
      {
        pattern: /^.+$/,
        message: 'stock quantity is required'
      }     
    ]
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { stockRules }