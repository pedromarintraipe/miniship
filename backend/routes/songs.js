const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { transposeChords } = require('../utils/transpose');
const { parseRawSongText } = require('../utils/parser');
const { scrapeCifraClub } = require('../utils/scraper');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL requerida' });
  try {
    const data = await scrapeCifraClub(url);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const { search } = req.query;
  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { artist: { contains: search, mode: 'insensitive' } },
      // PostgreSQL full text search could be used on JSON structure but basic text match works for simplicity
    ]
  } : {};
  const songs = await prisma.song.findMany({ where, orderBy: { title: 'asc' } });
  res.json(songs);
});

router.get('/:id', async (req, res) => {
  const song = await prisma.song.findUnique({ where: { id: req.params.id } });
  if (!song) return res.status(404).json({ error: 'Not found' });
  res.json(song);
});

router.post('/', async (req, res) => {
  const { title, artist, originalKey, structure, rawText } = req.body;
  
  let finalStructure = structure;
  if (!finalStructure && rawText) {
    finalStructure = parseRawSongText(rawText);
  }

  const song = await prisma.song.create({
    data: {
      title,
      artist,
      originalKey,
      structure: finalStructure || { sections: [] }
    }
  });
  res.json(song);
});

router.put('/:id', async (req, res) => {
  const { title, artist, originalKey, structure, rawText } = req.body;
  
  let finalStructure = structure;
  if (!finalStructure && rawText) {
    finalStructure = parseRawSongText(rawText);
  }

  const song = await prisma.song.update({
    where: { id: req.params.id },
    data: {
      title, artist, originalKey,
      ...(finalStructure && { structure: finalStructure })
    }
  });
  res.json(song);
});

router.delete('/:id', async (req, res) => {
  await prisma.song.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Endpoint for smart importer preview
router.post('/preview-import', (req, res) => {
  const { rawText } = req.body;
  const parsed = parseRawSongText(rawText);
  res.json({ structure: parsed });
});

module.exports = router;
