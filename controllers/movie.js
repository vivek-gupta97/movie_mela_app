const Sequelize = require("sequelize");
const Movie = require("../models/movie");

exports.getIndex = (req, res, next) => {
  Movie.findAll()   //it automatically get all movies from the database and assing it to req.products 
  //that means it already checks the condition of user id ;
    .then((movies) => {
      //console.log(req.session.isLoggedIn);
      res.render("movie/index", {
        movies: movies,
        pageTitle: "Home",
        path: "/" ,
        isAuthenticated: req.session.isLoggedin ,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => console.log(err));
};

exports.getUpcoming = (req, res, next) => {
  const today = new Date();
  Movie.findAll({
    where: {
      releaseDate: {
        [Sequelize.Op.gte]: today, // Op.gte stands for greater than or equal to
      },
    },
    order: [['releaseDate', 'ASC']], // Order by releaseDate in ascending order
    limit: 10
  })
    .then((upcomingMovies) => {
        res.render("movie/upcoming", {
        movies: upcomingMovies,
        pageTitle: "Upcoming Movies",
        path: "/upcoming",
        isAuthenticated: req.session.isLoggedin ,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => console.log(err));
};


exports.getTopMovie = (req, res, next) => {
  const today = new Date();
  Movie.findAll({where: {
    releaseDate: {
      [Sequelize.Op.lte]: today, // Op.gte stands for greater than or equal to
    },
  },
  order: [['releaseDate', 'ASC']], // Order by releaseDate in ascending order
  limit: 10
})
.then((topMovies) => {
  res.render("movie/top-ten", {
  movies: topMovies,
  pageTitle: "Top Movies",
  path: "/top-ten",
  isAuthenticated: req.session.isLoggedin ,
  csrfToken: req.csrfToken()
});
})
.catch((err) => console.log(err));
};
