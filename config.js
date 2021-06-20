/**
 * Configuration file for the project
 */

const config = {};

config.PORT = process.env.PORT || 3000; // Application PORT
config.dbPort = '27017'; // Database PORT
config.dbName = 'topcoder-courseware'; // Database Name

// Google Analytics Tracking ID. Please replace this !!
config.trackingID = 'UA-171522558-3';

module.exports = config;
