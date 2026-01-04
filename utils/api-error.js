class ApiError extends Error{
  constructor(statusCode, message="Something went wrong", errors = [], stack= ""){
    // stack has stack of error traces
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors
    
    if(stack){
      this.stack = stack
    }
    else{
      Error.captureStackTrace(this, this.cons)
    }
  }
}

export { ApiError };

// this all is done so that we have a predictible way of responses and errors
// matlab frontend vaalo , ya testers ko pata rhega ki ye data toh aayegi hi