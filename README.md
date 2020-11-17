# Technical Challenge

- install dependencies by running `npm install`
- Run a development build via docker `npm run build-dev` and navigate to `http://localhost:3000`
- Run a production build via docker `npm run build-prod` and `npm run prod` navigate to `http://localhost:1337`
- Run in debug mode via docker `npm run dev`
- If you dont want to run using docker you can as well run `mpm run start` and navigate to `http://localhost:2222`

### Architecture

- The table was build using a popular concept of dynamic rendering with inifinite scroll, which means only those elements that are returned from the server are rendered at any time , we reuse the rendering Dom element by replacing fresh items into the DOM this helps reduce the probability of lags on the front end when rendering huge dynamically sized data.
