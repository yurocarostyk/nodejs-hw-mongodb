export const handleSaveError = (err, data, next) => {
  err.status = 400;
  next();
};

export const setUpdateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};