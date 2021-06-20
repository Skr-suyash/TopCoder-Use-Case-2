
/**
 * Module for getting the filename out of the ID
 * @param {Number} id
 */

const getFileNameMaths = function(id) {
    const start = `Mathematics Ch-${id}: `;
    switch (id) {
    case '1':
        filename = start + 'Triangles';
        break;
    case '2':
        filename = start + 'Coordinate Geometry';
        break;
    case '3':
        filename = start + 'Number System';
        break;
    default:
        filename = null;
    }
    return filename;
};

const getFileNameScience = function(id) {
    switch (id) {
    case '1':
        filename = 'Physics Ch- Thermodynamics';
        break;
    case '2':
        filename = 'Physics Ch- Newton\'s Laws of Motion';
        break;
    case '3':
        filename = 'Chemistry Ch- Chemical Bonding';
        break;
    default:
        filename = null;
    }
    return filename;
};

const getFileNameEnglish = function(id) {
    switch (id) {
    case '1':
        filename = 'Ch 1- Tenses';
        break;
    case '2':
        filename = 'Ch 2- Modals';
        break;
    case '3':
        filename = 'Ch 3- Voice';
        break;
    default:
        filename = null;
    }
    return filename;
};

module.exports = {getFileNameMaths, getFileNameScience, getFileNameEnglish};
