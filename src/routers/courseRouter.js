// Imports
const express = require('express');
const router = new express.Router();
const fs = require('fs');

const getFileName = require('../util/getFileName');
const createPDF = require('../util/createPDF');
const config = require('../../config');
const Comment = require('../models/comments');

/**
 * Midddleware to check for authentication in routes
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function isAuthenticated(req, res, next) {
    if (req.session.name) {
        next();
    } else {
        res.redirect('/users/login'); // Redirect to login screen
    }
}

/**
 * Route to guide users to different courses
 */
router.get('/courses/:subject', isAuthenticated, (req, res) => {
    const subject = req.params.subject;
    res.render(`courses/${subject}`, {
        layout: 'courseLayout',
        title: `${capitalizeFirstLetter(subject)} Course`,
        script: 'chapters.js',
    });
});

/**
 * Route to guide users to different chapters
 */
router.get('/courses/:subject/:id', isAuthenticated, async (req, res) => {
    const subject = req.params.subject;
    const _id = req.params.id;

    // Check for subject and assign correct filename to it
    let fileName = '';
    if (subject == 'maths') {
        fileName = String(getFileName.getFileNameMaths(_id));
    } else if (subject == 'science') {
        fileName = String(getFileName.getFileNameScience(_id));
    } else {
        fileName = String(getFileName.getFileNameEnglish(_id));
    }

    const comments = await getComments(fileName);
    res.render('content', {
        layout: false,
        id: _id,
        fname: fileName,
        subject: subject,
        comments: comments.reverse(),
        trackingID: config.trackingID,
    });
});

/**
 * Route to post comments through ajax
 */
router.post('/comments', isAuthenticated, async (req, res) => {
    const comment = new Comment(req.body);
    try {
        await comment.save();
        res.send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/comments', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.body.id,
            {body: req.body.body},
            {new: true, runValidators: true,
            });
        res.send(comment);
    } catch (error) {
        res.send(400).send(error);
    }
});

router.delete('/comments', isAuthenticated, async (req, res) => {
    const id = req.body.id;
    try {
        await Comment.findByIdAndDelete(id);
        res.send('Success');
    } catch (error) {
        res.send(error);
    }
});

/**
 * Route to post reply through ajax
 */
router.post('/reply', isAuthenticated, async (req, res) => {
    const body = req.body;
    try {
        const comment = await Comment.findOne({_id: body.id});

        if (!comment) {
            res.status(400).send('Comment Not Found');
        } else {
            // Push the reply to replies array
            comment.replies.push({
                user: body.user,
                role: body.role,
                body: body.reply,
            });
            await comment.save();
            reply = comment.replies[comment.replies.length - 1];
            res.send(reply);
        }
    } catch (error) {
        res.send(error);
    }
});

/**
 * Route to guide users to the whiteboard screen
 */
router.get('/whiteboard', isAuthenticated, (req, res) => {
    res.render('whiteboard', {
        layout: false,
        trackingID: config.trackingID,
    });
});

/**
 * Receive the encoded Base64 Image data from the frontend
 */
router.post('/whiteboard/download', (req, res) => {
    const img = req.body.imgBase64;
    const data = img.replace(/^data:image\/\w+;base64,/, '');
    // Convert the data to a buffer
    const buf = Buffer.from(data, 'base64');
    const id = makeid(7); // Generate unique ID for file
    // Write the decoded file to a PNG file
    fs.writeFile(`temp/${id}.png`, buf, 'base64', async function(err) {
        if (err) {
            res.status(500).send('Error occured during saving');
        } else {
            // Convert the Image to PDF using Tools API
            await createPDF(`temp/${id}.png`, 'pdf'+id);
            res.send(id);
        }
    });
});

/**
 * Download the PDF File and then delete it
 */
router.get('/whiteboard/download/:id', isAuthenticated, (req, res) => {
    id = req.params.id;
    res.download(`temp/pdf${id}.pdf`, 'Notes.pdf', function(err) {
        if (err) {
            console.log(err);
        }
        // Delete the files after download
        files = [`temp/pdf${id}.pdf`, `temp/${id}.png`];
        files.forEach((path) => {
            fs.unlink(path, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
});

/**
 * Generate a random id for each download
 * @param {Number} length
 * @return {String} result
 */
function makeid(length) {
    let result = '';
    // eslint-disable-next-line max-len
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Function to retrieve comments and send to template
 * @param {String} fname - The Name of the file to search for
 * @return {Array} comments - List of comments to be returned
 */
async function getComments(fname) {
    try {
        const comments = await Comment.find({fname: fname}).lean();
        if (comments) {
            return comments;
        }
    } catch (error) {
        return null;
    }
}

/**
 * Function to capitalize firstletter
 * @param {String} string
 * @return {String}
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
