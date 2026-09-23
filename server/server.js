import express from 'express'; // ES6 and newer javascript
import homeRoutes from './routes/home-routes.js';
import aboutRoutes from './routes/about-routes.js';
import contactRoutes from './routes/contact-routes.js';
import projectsRoutes from './routes/projects-routes.js';
import servicesRoutes from './routes/services-routes.js';

const app = express(); 

app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/contact', contactRoutes);
app.use('/projects', projectsRoutes);
app.use('/services', servicesRoutes);

app.listen(3001);

console.log('Server is running on http://localhost:3001');