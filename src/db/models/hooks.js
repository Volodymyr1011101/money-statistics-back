export const handleServerError = (error, doc, next) => {
    error.status = (error.code === 11000 && error.name === 'MongoServerError') ? 409 : 400;
    next();
};

export const setUpdateSettings = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};