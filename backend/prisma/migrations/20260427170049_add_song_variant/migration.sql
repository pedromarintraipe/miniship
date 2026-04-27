-- AlterTable
ALTER TABLE "SetlistSong" ADD COLUMN     "variantId" TEXT;

-- CreateTable
CREATE TABLE "SongVariant" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetlistSong" ADD CONSTRAINT "SetlistSong_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "SongVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVariant" ADD CONSTRAINT "SongVariant_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongVariant" ADD CONSTRAINT "SongVariant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
