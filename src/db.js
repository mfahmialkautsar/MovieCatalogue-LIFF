const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(lineUid) {
  try {
    return await prisma.watchlist.findMany({
      where: {
        ownerId: lineUid,
      },
    });
  } catch (error) {}
}

async function getMovies(lineUid) {
  try {
    return await prisma.watchlist.findMany({
      where: {
        AND: [{ ownerId: lineUid }, { category: 'movie' }],
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function getTvs(lineUid) {
  try {
    return await prisma.watchlist.findMany({
      where: {
        AND: [{ ownerId: lineUid }, { category: 'tv' }],
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function get(lineUid, id) {
  try {
    return await prisma.watchlist.findFirst({
      where: {
        AND: [{ ownerId: lineUid }, { filmId: id }],
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function addUser(lineUid, lineName) {
  try {
    await prisma.user.upsert({
      where: {
        lineUid: lineUid,
      },
      update: {
        lineUid: lineUid,
        lineName: lineName,
      },
      create: {
        lineUid: lineUid,
        lineName: lineName,
      },
      select: {
        lineUid: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function addWL(lineUid, movie) {
  try {
    let title = movie.title || movie.name;
    title = title.replace("'", "''");
    const wlId = lineUid + movie.id;
    return await prisma.watchlist.upsert({
      where: {
        wlId: wlId,
      },
      update: {
        wlId: wlId,
        ownerId: lineUid,
        filmId: movie.id,
        title: title,
        category: movie.title ? 'movie' : 'tv',
      },
      create: {
        wlId: wlId,
        ownerId: lineUid,
        filmId: movie.id,
        title: title,
        category: movie.title ? 'movie' : 'tv',
      },
      select: {
        wlId: true,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.code === 'P2002') {
      return await delWL(lineUid, movie.id);
    }
  }
}

async function delWL(lineUid, filmId) {
  try {
    return await prisma.watchlist.deleteMany({
      where: {
        AND: [{ ownerId: lineUid }, { filmId: filmId }],
      },
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { addUser, getAll, get, addWL, delWL };
