let sqlite3 = require('sqlite3');

exports.loadUsers = (callback) => {
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