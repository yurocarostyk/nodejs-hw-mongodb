export const parseIsFavouriteFilter = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;

  return isFavourite;
};