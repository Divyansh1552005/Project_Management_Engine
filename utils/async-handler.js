// baar baar trycatch likhne ki jagah we will make a Higher order function
//
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    // sbhi function passed
    // We return a function because Express expects a function.
    // We handle the Promise inside that function.
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    // passing all errors to express inbuilt error
  };
};

export { asyncHandler };
