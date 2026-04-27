/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset = {
  tableName: "",
  status: 0,
  isOccupied: 0,
  size: 1,
  table_id : ""
}
const tableRules = {
  rules: {
    tableName: [
      {
        pattern: /^.+$/,
        message: 'table name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'table name must be no more than 50 characters'
      }
    ],    
  },
  reset: reset,
  fields: {
    ...reset
  },

}

export { tableRules }