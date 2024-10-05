export const calculatePaginationData = (contactsCount, page, perPage) => {
  const totalPages = Math.ceil(contactsCount / perPage);

  const hasNextPage = Boolean(totalPages - page);

  const hasPreviousPage = page !== 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};