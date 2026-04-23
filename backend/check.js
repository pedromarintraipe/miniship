const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const song = await prisma.song.findUnique({
    where: { id: '09639a09-3440-4cf9-8c62-1cbf9fad9aaa' }
  });
  console.log(JSON.stringify(song, null, 2));
}
check();
