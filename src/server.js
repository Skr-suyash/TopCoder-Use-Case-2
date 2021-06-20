// Imports
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');

require('./db/mongoose');

const config = require('../config'); // Configuration file for the project
const userRouter = require('./routers/userRouter');
const courseRouter = require('./routers/courseRouter');

// Express settings
const app = express();
const staticDir = path.join(__dirname, '../static');
app.use(express.static(staticDir));

// Set up express-handlebars and layouts
app.engine('.hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../views/layouts/'),
    // Create a hepler function for comparison
    helpers: {
        ifeq: function(a, b, options) {
            if (a == b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
    },
}));
app.set('view engine', '.hbs');

// Set up json exchange and parsing of request
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// Initialize session variables to store login data
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Defining local variables to send to all templates
app.use(function(req, res, next) {
    res.locals = {
        name: req.session.name,
        role: req.session.role,
    };
    next();
});

/**
 * Function to check for authentication
 * @param {String} name - The name of user from session cookies
 * @return {Boolean}
 */
function checkForAccess(name) {
    if (name) {
        return true;
    } else {
        return false;
    }
}

// Routers
app.use(userRouter);
app.use(courseRouter);

// Defining the Routes

/** Home Page */
app.get('/', (req, res) => {
    res.render('home', {
        layout: false,
    });
});

/** All Courses Page */
app.get('/courses', (req, res) => {
    if (checkForAccess(req.session.name)) {
        res.render('courses', {
            layout: 'courseLayout',
            title: 'All Courses',
            script: 'coursesNames.js',
        });
    } else {
        res.redirect('/users/login');
    }
});

/** Contact Us Page */
app.get('/contact', (req, res) => {
    res.render('contact', {layout: false});
});

// Start the server at port (9000)
const PORT = config.PORT;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
