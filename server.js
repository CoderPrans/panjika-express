import express from 'express';
import routes from './routes.js';
import path from 'path';

const app = express();

// views
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/', routes);

const server = app.listen(8000, function() { 
  console.log(`Server running on port ${server.address().port}`); 
});

