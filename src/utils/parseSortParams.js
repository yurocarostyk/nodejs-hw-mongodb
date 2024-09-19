import { SORT_ORDER } from '../constants/index.js';

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const parsedSortBy = sortBy === 'name' ? sortBy : '_id';

  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};