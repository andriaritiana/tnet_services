class InputValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InputValidationError'
    this.message = message
  }
}
class PermissionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PermissionError'
    this.message = message
  }
}
class DatabaseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DatabaseError'
    this.message = message
  }
}
module.exports = {
  InputValidationError,
  PermissionError,
  DatabaseError
}