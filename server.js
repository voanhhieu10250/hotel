const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;
const buildPath =
  process.env.NODE_ENV === 'production' ? '/build' : '/packages/hotel/build';

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, buildPath)));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
