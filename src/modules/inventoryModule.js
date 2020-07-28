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
        dbModule.selectQuery('SELECT itemID, SUM(receipts) as closingStock FROM entries GROUP BY itemID', function(err, rows) {
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

    uomQuery = new Promise((resolve, reject) => {
        dbModule.selectQuery('SELECT * FROM uom', (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    Promise.all([groupsQuery, subgroupsQuery, itemsQuery, inventoryQuery, uomQuery])
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

exports.getSubgroups = (callback) => {
    dbModule.selectQuery('SELECT * FROM subgroups ORDER BY name ASC', function(err, rows) {
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

exports.createGroup = (data, callback) => {
    dbModule.insert('groups', data, function(err, result) {
        callback(err, result);
    });
}

exports.createSubgroup = (data, callback) => {
    dbModule.insert('subgroups', data, function(err, result) {
        callback(err, result);
    });
}

exports.createItem = (data, callback) => {
    dbModule.insert('items', data, function(err, result) {
        callback(err, result);
    });
}

exports.createUOM = (data, callback) => {
    dbModule.insert('uom', data, function(err, result) {
        callback(err, result);
    });
}

exports.editSubgroup = (subgroupID, data, callback) => {
    dbModule.update('subgroups', 'id='+subgroupID, data, function(err, result) {
        callback(err, result);
    });
}

exports.getGroupsAndSubgroups = (callback) => {
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
        dbModule.selectQuery('SELECT * FROM subgroups ORDER BY groupID ASC', (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    Promise.all([groupsQuery, subgroupsQuery])
            .then((results)=>{
                callback('', results);
            })
            .catch((err)=>{
                callback(err);
            });
}

exports.getSubgroup = (subgroupID, callback) => {
    dbModule.selectQuery(`SELECT subgroups.id, subgroups.name, subgroups.groupID, groups.name AS groupName FROM subgroups INNER JOIN groups ON subgroups.groupID = groups.id WHERE subgroups.id=${subgroupID}`, (err, rows) => {
        if(err) {
            callback(err);
        } else {
            if(Object.keys(rows).length == 0) {
                dbModule.selectQuery('SELECT * FROM subgroups WHERE id = '+subgroupID, (err, rows)=>{
                    if(err)
                        callback(err);
                    else
                        callback('', rows);
                })
            } else {
                callback('', rows);
            }
                
            
        }
    });
}

exports.getSubgroupForEdit = (subgroupID, callback) => {
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
        dbModule.selectQuery(`SELECT * FROM subgroups WHERE id = '${subgroupID}'`, (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    Promise.all([groupsQuery, subgroupsQuery])
            .then((results)=>{
                callback('', results);
            })
            .catch((err)=>{
                callback(err);
            });
}

exports.getItems = (callback) => {
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

    Promise.all([groupsQuery, subgroupsQuery, itemsQuery])
            .then((results)=>{
                callback('', results);
            })
            .catch((err)=>{
                callback(err);
            });

}

exports.getItem = (itemID, callback) => {
    dbModule.selectQuery(`SELECT * FROM items WHERE id = ${itemID}`, (err, rows) => {
        if(err) {
            callback(err);
        } else {
            let subgroupID = rows[0].subgroupID;
            if(subgroupID!=0) {
                dbModule.selectQuery(`SELECT subgroups.id, subgroups.name, subgroups.groupID, groups.name AS groupName FROM subgroups INNER JOIN groups ON subgroups.groupID = groups.id WHERE subgroups.id=${subgroupID}`, (err, subgroupDetails) => {
                    if(err) {
                        callback(err)
                    } else {
                        let result = [rows, subgroupDetails];
                        callback('', result);
                    }
                });
            } else {
                callback('', rows);
            }
        }
    });
}

exports.getUOMs = (callback) => {
    dbModule.selectQuery('SELECT * FROM uom ORDER BY name ASC', (err, result) => {
        if(err) {
            callback(err);
        } else {
            callback('', result);
        }
    });
}