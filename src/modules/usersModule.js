const db = require('sqlite3-wrapper').open('./skeleton.db');
let sqlite3 = require('sqlite3');

exports.loadUsersBacup = (callback) => {
    var resultHTML = '';

    let db = new sqlite3.Database('./skeleton.db', sqlite3.OPEN_READWRITE, (err)=>{
        if(err) {
            callback('Error: Cannot access database', null);
            console.log(err);
        } else {
            console.log('Successfully connected to DB');
        }
    });

    db.serialize(() => {
        var resultHTML;
        db.all(`SELECT * FROM users`, (err, rows) => {
            if (err) {
                callback(err, null);
            }
            callback(null, rows);
        });
    });    

    // close the DB
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Close the database connection.');
        }
    });
}

exports.loadUsers = (callback) => {
    db.select("SELECT * FORM users", function(err, rows) {
        callback(err, rows);
    });
}