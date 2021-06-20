/**
 * Router for creation and logging in of users
 */

// Imports
const express = require('express');
const router = new express.Router();
const User = require('../models/user');

/**
 * Show Sign Up Page
 */
router.get('/users/signup', (req, res) => {
    res.render('signup', {layout: false});
});

/**
 * Show Login Page
 */
router.get('/users/login', (req, res) => {
    res.render('login', {layout: false});
});

/**
 * Create an account for the user
 */
router.post('/users/signup', async (req, res) => {
    const body = req.body;
    const user = new User(body);
    try {
        await user.save();

        /* Render the auth. user to home page and save
        the details as session cookies */
        req.session.name = user.name;
        req.session.role = user.role;
        res.redirect('/');
    } catch (e) {
        res.status(400).render('signup', {
            layout: false,
            error: 'Sign Up failed. Please check your credentials.',
        });
    }
});

/**
 * Log In the User
 */
router.post('/users/login', async (req, res) => {
    const body = req.body;

    try {
        const user = await User.findByCredentials(body.email, body.password);
        // Render the auth. user to home page
        if (!user) {
            res.render('login', {layout: false, error: 'User not found'});
        } else {
            req.session.name = user.name;
            req.session.role = user.role;
            res.redirect('/');
        }
    } catch (error) {
        res.status(400).render('login', {layout: false,
            error: 'User not found. Incorrect email or password.',
        });
    }
});

/**
 * Logout the users and destroy the session cookies
 */
router.get('/users/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
            }
            res.redirect('/');
        });
    }
});

module.exports = router;
