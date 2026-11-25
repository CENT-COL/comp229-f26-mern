import {expect, jest, test} from '@jest/globals';

import authMiddleware from './auth.js';

test('rejects a request without a token', () => {
    // Preparation
    const req = { headers: {} };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    // Execution

    authMiddleware(req, res, next);

    // Assertion

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();

});