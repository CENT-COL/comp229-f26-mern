// Import Jest's test function, assertions, and mock-function helper.
import { expect, jest, test } from '@jest/globals'
// Import the actual middleware we want to test.
import authMiddleware from './auth.js'

// Check what happens when a request does not include an authentication token.
test('rejects a request without a token', () => {
  // Create a simplified request with no authorization header.
  const req = { headers: {} }
  // Create a simplified response with mock functions that record their calls.
  const res = {
    // Return the response object so the middleware can chain status(...).json(...).
    status: jest.fn().mockReturnThis(),
    // Record the JSON body the middleware sends.
    json: jest.fn(),
  }
  // Mock Express's next function to check whether the request continues.
  const next = jest.fn()

  // Run the middleware using our simulated request, response, and next function.
  authMiddleware(req, res, next)

  // Check that the middleware responds with HTTP 401 Unauthorized.
  expect(res.status).toHaveBeenCalledWith(401)
  // Check that it sends the expected error message.
  expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' })
  // Check that it does not pass the unauthenticated request to the next handler.
  expect(next).not.toHaveBeenCalled()
})
