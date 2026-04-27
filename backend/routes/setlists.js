const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const setlists = await prisma.setlist.findMany({
    orderBy: { date: 'desc' },
    include: {
      SetlistSong: {
        include: { song: true, variant: true },
        orderBy: { position: 'asc' }
      }
    }
  });
  res.json(setlists);
});

router.post('/', async (req, res) => {
  const { name, description, date } = req.body;
  const setlist = await prisma.setlist.create({
    data: { name, description, date: date ? new Date(date) : null }
  });
  res.json(setlist);
});

router.get('/:id', async (req, res) => {
  const setlist = await prisma.setlist.findUnique({
    where: { id: req.params.id },
    include: {
        SetlistSong: {
          include: { song: true, variant: true },
          orderBy: { position: 'asc' }
        }
    }
  });
  if (!setlist) return res.status(404).json({ error: 'Not found' });
  res.json(setlist);
});

router.put('/:id', async (req, res) => {
  const { name, description, date } = req.body;
  const setlist = await prisma.setlist.update({
    where: { id: req.params.id },
    data: { name, description, date: date ? new Date(date) : null }
  });
  res.json(setlist);
});

router.delete('/:id', async (req, res) => {
  await prisma.setlist.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Setlist Songs
router.post('/:setlistId/songs', async (req, res) => {
  const { setlistId } = req.params;
  const { songId, variantId, position, selectedKey, notes } = req.body;
  
  const setlistSong = await prisma.setlistSong.create({
    data: {
      setlistId,
      songId,
      ...(variantId && { variantId }),
      position,
      selectedKey,
      notes
    },
    include: { song: true, variant: true }
  });
  res.json(setlistSong);
});

router.put('/songs/:setlistSongId', async (req, res) => {
  const { position, selectedKey, notes } = req.body;
  const setlistSong = await prisma.setlistSong.update({
    where: { id: req.params.setlistSongId },
    data: { position, selectedKey, notes }
  });
  res.json(setlistSong);
});

router.delete('/songs/:setlistSongId', async (req, res) => {
  await prisma.setlistSong.delete({ where: { id: req.params.setlistSongId } });
  res.status(204).send();
});

module.exports = router;
