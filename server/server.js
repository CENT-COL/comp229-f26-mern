import mongoose from 'mongoose';

import express from 'express'; // ES6 and newer javascript
import homeRoutes from './routes/home-routes.js';
import aboutRoutes from './routes/about-routes.js';
import contactRoutes from './routes/contact-routes.js';
import projectsRoutes from './routes/projects-routes.js';
import servicesRoutes from './routes/services-routes.js';

// Establish DB Connection
mongoose.connect("mongodb://localhost:27017/mern-portfolio");
const connection = mongoose.connection; 
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

const app = express(); 

app.use(express.json()); // for parsing application/json

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/projects', projectsRoutes);
app.use('/services', servicesRoutes);

app.listen(3001);

console.log('Server is running on http://localhost:3001');