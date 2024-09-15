import dotenv from 'dotenv';

dotenv.config();

// export const env = (name, defaultValue) => {
//   const value = process.env[name];

//   if (value) return value;

//   if (defaultValue) return defaultValue;

//   throw new Error(`Missing: process.env[${name}]`);
// };
export const env = (key, defaultValue) => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing: process.env['${key}']`);
  }
  return value || defaultValue;
};
