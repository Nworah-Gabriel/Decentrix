import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import yamljs from 'yamljs';
import path from 'path';
import { config } from '../config';
import apiRoutes from '../routes/index';
import { connectDB } from '../config/database';

const app: Application = express();

// Connect to MongoDB
connectDB().then(() => {
    console.log('MongoDB connection established');
}).catch(error => {
    console.error('MongoDB connection failed:', error);
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// API Documentation
const openapiSpecPath = path.join(__dirname, '../../openapi.yaml');
const spec = yamljs.load(openapiSpecPath);

app.get('/openapi.json', (_req: Request, res: Response) => { 
   res.setHeader('Content-Type', 'application/json'); 
   res.send(spec); 
});

app.get('/api-docs', (_req: Request, res: Response) => {
   const html = `
   <!DOCTYPE html>
   <html>
   <head>
       <title>Sui Attestation Service API Docs</title>
       <meta charset="utf-8"/>
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
       <style>
           body { margin: 0; padding: 0; }
       </style>
   </head>
   <body>
       <div id="redoc-container"></div>
       <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
       <script>
           document.addEventListener('DOMContentLoaded', function() {
               Redoc.init('/openapi.json', {
                   theme: { colors: { primary: { main: '#dd5522' } } },
                   scrollYOffset: 50,
                   hideDownloadButton: false
               }, document.getElementById('redoc-container'));
           });
       </script>
   </body>
   </html>`;
   res.send(html);
});


app.get('/', (req: Request, res: Response): void => {
    res.send('Sui Attestation Service is running. Visit /api-docs.');
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
   console.error("Global Error Handler:", err.message, err.stack);
   if (res.headersSent) { return next(err); }
   res.status(500).json({
       error: 'An unexpected error occurred.',
       message: err.message || 'Internal Server Error'
   });
});


export default app;