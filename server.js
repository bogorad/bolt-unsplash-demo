import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.use(express.static('dist'));

app.get('/images', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=8&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const images = await response.json();

    const imageGrid = images
      .map(
        (image) => `
      <div class="flex flex-col">
        <a href="${image.links.html}" target="_blank" rel="noopener noreferrer" class="aspect-square mb-2">
          <img src="${image.urls.small}" alt="${image.alt_description || 'Unsplash Image'}" class="w-full h-full object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity">
        </a>
        <p class="text-sm text-center truncate">${image.user.name}</p>
      </div>
    `
      )
      .join('');

    res.send(imageGrid);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Error fetching images');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});