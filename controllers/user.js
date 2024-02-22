const Movie = require("../models/movie");
const User = require("../models/user");
const WatchedMovie = require("../models/watched");

exports.getAddMovie = (req, res, next) => {
  res.render("user/add-movie", {
    pageTitle: "Add Movie",
    path: "/user/add-movie",
    isAuthenticated: req.session.isLoggedin ,
    csrfToken: req.csrfToken()

  });
};

exports.postAddMovie = (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const length = req.body.length;
  const storyLine = req.body.storyLine;
  const cast = req.body.cast;
  const genre = req.body.genre;
  const releaseDate = req.body.releaseDate;
  Movie.create({    
    name: name,
    imageUrl: imageUrl,
    length: length,
    storyLine: storyLine,
    cast: cast,
    genre: genre,
    releaseDate: releaseDate
    //userId: req.user.id
  })
    .then((products) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};


exports.getUserEdit = (req,res,next) => {
  const userId = req.user.id;
  User.findByPk(userId).then((user)=>{
    res.render("user/edit-user", {
      path: "/user/edit",
      pageTitle: "User Dashboard",
      user: req.user,
      isAuthenticated : req.session.isLoggedin ,
      csrfToken: req.csrfToken()
    });
  }).catch(err=> console.log(err));
};

exports.postUserEdit = (req,res,next) => {
  const userId = req.user.id;
  const updatedGenre = req.body.genre;

  User.findByPk(userId)
  .then((user)=>{
    user.genre=updatedGenre;
    return user.save();
  }).then(()=>{
    res.redirect('/user/recommended');
  })
  .catch(err=> console.log(err));
};

exports.getMovies = (req, res, next) => {
  Movie.findAll()   //it automatically get all movies from the database and assing it to req.products 
  //that means it already checks the condition of user id ;
    .then((movies) => {
      res.render("", {
        movies: movies,
        pageTitle: "Home",
        path: "/movie/index" ,
        isAuthenticated: req.session.isLoggedin ,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => console.log(err));
};

exports.getRecommended = (req, res, next) => {

  Movie.findAll({
    where: {
      genre: req.user.genre
    },
    limit: 10
  })
    .then((genreMovies) => {
        res.render("movie/recommended", {
        movies: genreMovies,
        pageTitle: "Recommended Movies",
        path: "/user/recommended",
        isAuthenticated: req.session.isLoggedin
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddToWishlist = (req, res, next) => {
  const movieId = req.params.movieId;
  let fetchedWishlist;
  req.user.getWishlist()
  .then(wishlist => {
    fetchedWishlist = wishlist;
    return wishlist.getMovies({where: {id: movieId}});
  })
  .then(movies=>{
    let movie;
    if(movies.length >0){
      movie = movies[0];
    }
    if(movie){
      return res.redirect('/user/watched')
    }
     Movie.findByPk(movieId)
     .then(movie => {
      return fetchedWishlist.addMovie(movie);
     })
     .then(()=>{
      res.redirect('/user/wishlist');
     })
  })
  .catch(err=> console.log(err));

};

exports.getMyWishlist = (req, res, next) => {
  req.user.getWishlist()
  .then(wishlist => {
    return wishlist.getMovies();
  })
  .then(movies => {
    res.render("movie/wishlist", {
      movies: movies,
      pageTitle: "My Wishlist",
      path: "/user/wishlist",
      isAuthenticated: req.session.isLoggedin ,
      csrfToken: req.csrfToken()
    });
  }).catch(err => console.log(err));
 };

exports.getAddToWatch = (req, res, next) => {
  const movieId = req.params.movieId;
//firstly removing the movie from wishlist then adding to the watched movie and if already exist then redirect to the watched Movie
  req.user.getWishlist()
  .then(wishlist => {
    return wishlist.removeMovies(movieId);
  })
  .then(()=>{
    return req.user.getMovies({where: {id: movieId}})
  })
  .then(movies =>{
    let movie;
    if(movies.length >0){
      movie = movies[0];
    }
    if(movie){
      
    }
    Movie.findByPk(movieId)
     .then(movie => {
      return req.user.addMovie(movie);
     })
     .then(()=>{
         res.redirect('/user/watched-movie');
     })
  })
  .catch(err=> console.log(err));

 };

 exports.getWatchedMovies = (req, res, next) => {
  req.user.getMovies()
  .then(movies => {
    res.render("movie/watched", {
      movies: movies,
      pageTitle: "Watched Movies",
      path: "/user/watched-movie",
      isAuthenticated: req.session.isLoggedin ,
      csrfToken: req.csrfToken()
    });
  }).catch(err => console.log(err));
 };

 