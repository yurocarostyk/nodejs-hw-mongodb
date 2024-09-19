import { parseContactTypeFilter } from './parseContactTypeFilter.js';

import { parseIsFavouriteFilter } from './parseIsFavouriteFilter.js';

export const parseFilterParams = ({ contactType, isFavourite }) => {
  const parsedType = parseContactTypeFilter(contactType);

  const parsedIsFavourite = parseIsFavouriteFilter(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};