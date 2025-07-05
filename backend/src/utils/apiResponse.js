class APIResponse {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.success = true;
    this.data = data;
    this.message = message;
  }
}

export default APIResponse;
