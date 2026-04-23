/* eslint-disable prettier/prettier */
const reset = {
  name: "",
  bar_code: "",
  color_code: "",
  price: '',
  cost: '',
  stock: '',
  status: 0,
  category_id: '',
  icon_name: ''
}
const menuRules = {
  rules: {
    name: [
      {
        pattern: /^.+$/,
        message: 'menu name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'menu name must be no more than 50 characters'
      }
    ],
    price: [
      {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: 'price is required'
      }
    ],
    category_id: [
      {
        pattern: /^.+$/,
        message: 'category is required'
      }
    ]
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { menuRules }