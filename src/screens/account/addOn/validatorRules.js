/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset = {
  addOnName: "",
  price: "",
  quantity: "",
   addOn_id: "",
     status: 0
}
const addOnRules = {
  rules: {
    addOnName: [
      {
        pattern: /^.+$/,
        message: 'addOn name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'addOn name must be no more than 50 characters'
      }
    ]    
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { addOnRules }