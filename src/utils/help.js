
import { faker } from '@faker-js/faker';
import { theme } from './theme';

export const isValidColor = value =>
  /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(value)
export const isValidNumber = value =>
  typeof value === 'number' && isFinite(value)
export const isValidString = value =>
  typeof value === 'string' && value.trim().length > 0

const generateRandomData = () => {
  return {
    name: faker.company.name(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    user_name: faker.internet.userName(),
    email: faker.internet.email(),
    mobile: faker.phone.number().slice(0, 12),
    password: '1234567',
    address: faker.location.streetAddress(),
    role: 'admin',
    pass_code: 1234,
  };
};

const toWordCase = (str) => {
  return str.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
};

const getGreetings = () => {
  const currentTime = new Date().getHours();
  let greeting;

  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return greeting;
};

const dateConverter = (stringDate) => {
  return stringDate.split("T")[0].split("-").reverse().join("-")
};

function formatDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("T");
  const formattedDate = datePart.split("-").reverse().join("-");
  const formattedTime = timePart.split(".")[0];

  return `${formattedDate} ${formattedTime}`;
}

function formatCurrency(currencySymbol, amount) {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return amount;
  }

  const formattedAmount = currencySymbol + numericAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

  return formattedAmount;
}

function currencySymbolMapper(currencySymbol) {
  const currencyMap = {
    "£": "gbp",
    "$": "usd",
    "aed": "aed",
    "afn": "afn",
    "all": "all",
    "amd": "amd",
    "usdc": "usdc",
    "btn": "btn",
    "ghs": "ghs",
    "eek": "eek",
    "lvl": "lvl",
    "svc": "svc",
    "vef": "vef",
    "ltl": "ltl",
    "sll": "sll",
  };

  if (currencySymbol in currencyMap) {
    return currencyMap[currencySymbol];
  } else {
    return "gbp";
  }
}

function generatePaymentId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function guid() {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}

const backgroundColorHelper = status => {
  switch (status.toLowerCase()) {
    case 'progress':
      return theme.colors.amber[100];
    case 'completed':
    case 'paid':
      return theme.colors.green[100];
    case 'pending':
    case 'unpaid':
      return theme.colors.indigo[100];
    case 'cancelled':
      return theme.colors.red[100];
    default:
      return theme.colors.gray[100];
  }
};

const textColorHelper = status => {
  switch (status.toLowerCase()) {
    case 'progress':
      return theme.colors.amber[800];
    case 'completed':
    case 'paid':
      return theme.colors.green[800];
    case 'pending':
    case 'unpaid':
      return theme.colors.indigo[800];
    case 'cancelled':
      return theme.colors.red[800];
    default:
      return theme.colors.gray[800];
  }
};

const paymentOptions = [
  { key: "cash", label: "Cash", icon: "attach-money" },
  { key: "card", label: "Card", icon: "credit-card" },
];

function getDateAndTimeSeparate(dateInput = new Date()) {
    const date = new Date(dateInput);
    
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    return {
        date: `${year}-${month}-${day}`,     // "2025-12-22"
        time: `${hours}:${minutes}:${seconds}` // "09:25:21"
    };
}

function getFormattedDate(dateInput = new Date()) {
    const date = new Date(dateInput);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getFormattedTime(dateInput = new Date()) {
    const date = new Date(dateInput);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const colorCodeStatus = status => {
  switch (status?.toLowerCase()) {
    case 'progress':
      return theme.colors.amber[600];
    case 'completed':
    case 'paid':
      return theme.colors.green[600];
    case 'pending':
    case 'unpaid':
      return theme.colors.purple[600];
    case 'cancelled':
      return theme.colors.red[600];
    default:
      return theme.colors.gray[800];
  }
};

const getLastChars = (str, limit = 8) => {
    if (!str || typeof str !== 'string') return '';
    return str.slice(-Math.max(0, Math.floor(limit)));
};

const convertDateFilter = (startDateString, endDateString) => {
    // Convert string dates to Date objects for Realm query
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    
    // Set end date to end of day to include all orders on that day
    endDate.setHours(23, 59, 59, 999);
    
    return { startDate, endDate };
};

 const statusOptions = ["All", "Progress", "Pending", "Completed", "Cancelled"];

 const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        const capitalize = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export { capitalize, formatDate, statusOptions, convertDateFilter, getLastChars, colorCodeStatus, getFormattedTime,getFormattedDate,getDateAndTimeSeparate, guid, paymentOptions, formatDateTime, getGreetings, generatePaymentId, currencySymbolMapper, generateRandomData, toWordCase, formatCurrency, dateConverter, backgroundColorHelper, textColorHelper }