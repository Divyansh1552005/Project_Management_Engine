class ApiResponse{
  constructor(statusCode, data, message= "Success"){
    this.statusCode = statusCode.statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400 // becoz we are doing successful 
  }
}


export {ApiResponse}

