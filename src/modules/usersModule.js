let sqlite3 = require('sqlite3');

exports.loadUsers = (callback) => {
    var resultHTML = '';

    let db = new sqlite3.Database('./skeleton.db', sqlite3.OPEN_READWRITE, (err)=>{
        if(err) {
            console.log(err);
        } else {
            console.log('Successfully connected to DB');
        }
    });

    db.serialize(() => {
        var resultHTML;
        db.each(`SELECT * FROM users`, (err, row) => {
            if (err) {
                console.log(err);
                return(err.message);
            }
            resultHTML += (row.id + "\t" + row.username);
            console.log(resultHTML);
            callback('', resultHTML);
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