const dbModule = require('./dbModule.js');

exports.getUserByUsername = (username, callback) => {
    dbModule.selectQuery(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
        if(err) {
            callback(err);
        } else {
            console.log(result);
            callback('', result);
        }
    });
}