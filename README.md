# MovieCatalogue-LIFF

Basically the same as my android [The Movie Catalogue](https://github.com/mfahmialkautsar/TheMovieCatalogue), but you can run this on any browser you have on your phone and computer.
And if you login with your [LINE Messenger](https://line.me) account, you can get Watchlist feature. This can be happened with the help of LIFF ([LINE Front-end Framework](https://developers.line.biz/en/docs/liff/overview/)).

Just a try and error app. Using only a clean Node.js and a prisma package only.

## Screenshot

<img src="./screenshots/computer_films.png" title="Films (Computer)">&nbsp;
<img src="./screenshots/computer_detail.png" title="Detail (Computer)">
<img src="./screenshots/phone_home.jpg" width="256" title="Home (Phone)">
<img src="./screenshots/phone_detail.jpg" width="256" title="Detail (Phone)">

### App Features

- [x] Discover Movies & TV Series Information
- [x] Movies & TV Series Search
- [x] Watchlist
- [x] LINE Front-end Framework Integration

### Sample

https://liff.line.me/1653723806-zZml2obV (or you can access https://liff-movie.vercel.app)

### Configuration

- Run `npm i`
- Endpoint URL at LIFF [LINE Developers Console](https://developers.line.biz/en/docs/liff/overview/): Your domain

### Environment

- `DATABASE_URL`: Database url
- `MOVIE_DB_API`: Your TMDB API key
- `LIFF_ID`: From [LINE Developers Console](https://developers.line.biz/console)

### Built With

- [TMDB](https://developers.themoviedb.org/3)
- [LINE Front-end Framework SDK](https://developers.line.biz/en/docs/liff/overview/)
- [Node.js](https://nodejs.org/en/docs/)
- [Prisma](https://www.prisma.io/docs)
- [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction)
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome)

## Author

- **Fahmi Al**
