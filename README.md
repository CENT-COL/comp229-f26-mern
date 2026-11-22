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

## Playwright end-to-end tests

### Install Playwright

This project was set up using the [Playwright Test for VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
with JavaScript. To set up Playwright in a new project:

1. Install Node.js and the Playwright extension in VS Code.
2. Open the project in VS Code, then open the Command Palette
   (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux).
3. Run **Test: Install Playwright**. Choose JavaScript if prompted and select
   Chromium. The GitHub Actions workflow is optional.

Playwright is already configured in this repository, so students who clone it
do not need to run the setup command again. Instead, from the project root,
install the root dependencies and Chromium:

```sh
npm install
npx playwright install chromium
```

### Save an authenticated session

Create the folder and open the recorder:

```sh
mkdir -p playwright/.auth
npx playwright codegen --save-storage=playwright/.auth/user.json \
  https://comp229-f25-mern.onrender.com/
```

Log in with your password and authenticator code. Once logged in, close the
browser to save the session. Repeat this step when the token expires. The
saved file contains a login token, so do not share or commit it;
`playwright/.auth/` is already in `.gitignore`.

### Record and run a test

Record a new test using the saved session:

```sh
npx playwright codegen --load-storage=playwright/.auth/user.json \
  --output=tests/project.spec.js \
  https://comp229-f25-mern.onrender.com/projects
```

Close the browser when you finish recording. `--output` writes the test file;
use a different filename if you do not want to overwrite an existing test.
Add this line after the import in the generated test so it also uses the saved
session when it runs:

```js
test.use({ storageState: 'playwright/.auth/user.json' });
```

Run the recorded test in a visible Chromium browser:

```sh
npx playwright test tests/project.spec.js --project=chromium --headed
```

To run the existing example instead, replace `tests/project.spec.js` with
`tests/example.spec.js`. These tests use the deployed application and can
modify its data. Review recorded tests before committing them and remove any
passwords or authenticator codes.
