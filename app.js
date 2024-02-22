const dotenv = require( 'dotenv').config();
const express = require('express');
const app = express();
const sequelize = require("./util/database");//importing  the database connection

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const path = (require('path'));

const csrf = require('cusrf-alternative'); // to protect from cross side request frogery
const csrfProtection = csrf();
const flash = require('connect-flash');

/*here i am importing Routes */
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');
const errorController = require('./controllers/error');//importing the error controller

/* here i am importing all the models or so called mysql tables*/
const Movie = require("./models/movie");
const User = require("./models/user");
const Wishlist = require("./models/wishlist");
const ListItem = require("./models/list-item");
const WatchedMovie = require("./models/watched");


app.use(express.static(path.join(__dirname, 'public')));// to serve the static file of css in the  public folder

app.set('view engine', 'ejs');// setting the templating engine to ejs
app.set('views', 'views'); // views set to veiws folder--- which means it searches the egs file in views folder


/* here i am importing the session and setting the storage  method as a Sequelize store */
const session = require('express-session');

const SequelizeStore = require( "connect-session-sequelize")(session.Store);  // connects sessions with our database for user authentication
const sessionStore = new SequelizeStore({
    db: sequelize,
  });

  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  }));
  app.use(flash()); // this middleware is for showing messages after performing some action like login , signup etc 
  
  app.use(csrfProtection); //this middleware will be used to add the CSRF token to every post request
  
  app.use((req, res, next)=>{
    if(!req.session.user){
       return next();
    }
    User.findByPk(req.session.user.id).then(user =>{
        req.user=user;
        next();
    }).catch(err=>console.log(err));
  });
 
  //this middleware checks for is user logged in or not and also for csrf token for every post request
  //or we can say its a way to to inject our data into each request.
  // app.use((req, res, next) => {
  //  req.locals.isAuthenticated = req.session.isLoggedin;
  // //  req.locals.csrfToken =  req.csrfToken();//this method is provided by csurf  packaage
  //  next();
  // });

app.use('/user' ,userRoutes);
app.use(authRoutes);
app.use(movieRoutes);

app.use(errorController.get404);
app.use('/favicon',(req, res, next)=>{ });



User.hasOne(Wishlist, { foreignKey : "userId" }); // user has one wishlist
Wishlist.belongsTo(User);  // wishlist belongs to a user

Wishlist.belongsToMany(Movie ,{through: ListItem});
Movie.belongsToMany(Wishlist , {through: ListItem});

User.belongsToMany(Movie , {through : WatchedMovie});

sequelize
//  .sync({force: true})
 .sync()  
.then(user => {
    console.log('connected');
    app.listen(process.env.PORT||3000);
  })
  .catch(err=>{console.log(err)});
