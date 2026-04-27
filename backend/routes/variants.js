const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { parseRawSongText } = require('../utils/parser');
const prisma = new PrismaClient();
const router = express.Router();

// GET all variants for a specific song
// Should probably filter by public=true OR user's own variants
// Since we don't have full auth middleware injecting user ID right now (we simulate user roles on frontend),
// we might need to pass userId as a query parameter for now.
router.get('/', async (req, res) => {
  const { songId, userId, role } = req.query;
  if (!songId) return res.status(400).json({ error: 'songId required' });

  const where = { songId };
  
  if (role !== 'ADMIN') {
    where.OR = [
      { isPublic: true },
    ];
    if (userId) {
      where.OR.push({ userId });
    }
  }

  const variants = await prisma.songVariant.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  
  res.json(variants);
});

router.post('/', async (req, res) => {
  const { songId, userId, name, structure, rawText, isPublic } = req.body;
  
  if (!songId || !userId || !name) {
    return res.status(400).json({ error: 'songId, userId, and name are required' });
  }

  let finalStructure = structure;
  if (!finalStructure && rawText) {
    finalStructure = parseRawSongText(rawText);
  }

  const variant = await prisma.songVariant.create({
    data: {
      songId,
      userId,
      name,
      structure: finalStructure || { sections: [] },
      isPublic: isPublic || false
    }
  });

  res.json(variant);
});

router.put('/:id', async (req, res) => {
  const { name, structure, rawText, isPublic } = req.body;
  
  let finalStructure = structure;
  if (!finalStructure && rawText) {
    finalStructure = parseRawSongText(rawText);
  }

  const variant = await prisma.songVariant.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(finalStructure && { structure: finalStructure }),
      ...(isPublic !== undefined && { isPublic })
    }
  });

  res.json(variant);
});

router.delete('/:id', async (req, res) => {
  await prisma.songVariant.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;
