const addOnRules = {
  rules: {
    addOnName: [
      {
        pattern: /^.+$/,
        message: 'addon name is required',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'addon name must be no more than 50 characters',
      },
    ],
    price: [
      {
        pattern: /^.+$/,
        message: 'price is required',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'price must be no more than 50 characters',
      },
    ],
  },
  fields: {
    addOnName: '',
    price: '',
  },
};

export {addOnRules};
