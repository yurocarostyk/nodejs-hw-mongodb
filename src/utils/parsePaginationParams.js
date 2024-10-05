const parseInterger = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue;

  const parsedValue = parseInt(value);

  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = parseInterger(page, 1);
  const parsedPerPage = parseInterger(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};