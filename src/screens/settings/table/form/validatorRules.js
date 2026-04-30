/* eslint-disable prettier/prettier */
const reset = {
  tableName: '',
  status: 0,
  isOccupied: 0,
  size: 1,
  table_id: '',
  location: 'Dine In',
  color_code: '',
};

const tableRules = {
  rules: {
    tableName: [
      {pattern: /^.+$/, message: 'Table name is required'},
      {pattern: /^.{0,50}$/, message: 'Table name must be no more than 50 characters'},
    ],
  },
  reset,
  fields: {...reset},
};

export {tableRules};