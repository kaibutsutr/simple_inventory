const dbModule = require('./dbModule.js');

exports.getCurrentInventory = (callback) => {
    groupsQuery = new Promise((resolve, reject) => {
        dbModule.selectQuery('SELECT * FROM groups', (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    subgroupsQuery = new Promise((resolve, reject) => {
        dbModule.selectQuery('SELECT * FROM subgroups', (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    itemsQuery = new Promise((resolve, reject) => {
        dbModule.selectQuery('SELECT * FROM items', (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    inventoryQuery = new Promise((resolve, reject) => {
        dbModule.selectQuery('SELECT itemID, SUM(receipts) as closingStock FROM entries', function(err, rows) {
            if(err) {
                reject(err);
            } else {
                let inventoryResult = [];
                for(let key in rows) {
                    inventoryResult[rows[key].itemID] = rows[key].closingStock;
                }
                resolve(inventoryResult);
            }
        });
    });

    Promise.all([groupsQuery, subgroupsQuery, itemsQuery, inventoryQuery])
            .then((results)=>{
                callback('', results);
            })
            .catch((err)=>{
                callback(err);
            });

}

exports.getGroups = (callback) => {
    dbModule.selectQuery('SELECT * FROM groups ORDER BY name ASC', function(err, rows) {
        callback(err, rows);
    });    
}

exports.getGroup = (groupID, callback) => {
    dbModule.selectQuery('SELECT * FROM groups WHERE id = '+groupID, function(err, rows) {
        console.log(rows);
        callback(err, rows);
    });
}

exports.editGroup = (groupID, data, callback) => {
    dbModule.update('groups', 'id='+groupID, data, function(err, result) {
        callback(err, result);
    });
}