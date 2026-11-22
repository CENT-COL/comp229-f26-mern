# MERN Skeleton

## Running the tests

From the project root, install the client and server dependencies (including
the test tools already listed in their `package.json` files):

```sh
npm install --prefix client
npm install --prefix server
```

For reference, the test tools were added with these commands. Students who
already have the updated `package.json` files do not need to run them:

```sh
npm install --prefix client --save-dev vitest jsdom @testing-library/react @testing-library/dom
npm install --prefix server --save-dev jest
```

Vitest runs the client test, jsdom simulates a browser, and React Testing
Library renders and searches the component. Jest runs the server test.

From the project root, run both tests:

```sh
npm test
```

Run them separately with `npm run test:client` or `npm run test:server`.
The client test checks that the home page sets its image as a background. The server
test checks that authentication rejects a request without a token. Neither
test needs a running server or a MongoDB connection.

The client uses Vitest with the existing Vite configuration to handle React
JSX, and jsdom to simulate a browser. The server uses Jest with Node's
experimental VM modules support to run JavaScript modules without Babel.
