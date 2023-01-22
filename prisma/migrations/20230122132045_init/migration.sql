-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "lineUid" STRING NOT NULL,
    "lineName" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "wlId" STRING NOT NULL,
    "filmId" INT4 NOT NULL,
    "title" STRING NOT NULL,
    "category" STRING NOT NULL,
    "ownerId" STRING NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_lineUid_key" ON "User"("lineUid");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_wlId_key" ON "Watchlist"("wlId");

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("lineUid") ON DELETE RESTRICT ON UPDATE CASCADE;
