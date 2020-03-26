const sqlite3 = require('sqlite3').verbose();

const DB_NAME = "../../DBAccess/SQLDatabase/RCL_LOCAL_SQL_DB.db";


class SQLConnectivity{

    static getInstance(){
        return instance;
    }

    constructor(){
        this.db = new sqlite3.Database(DB_NAME);
        this.db.run('CREATE TABLE IF NOT EXISTS PMs(' +
            'date text,' +
            'entity text,' +
            'shift INTEGER,' +
            'PM text,' +
            'G2G text,' +
            'automon text,' +
            'FQP text,' +
            'comment text,'+
            'PRIMARY KEY (date, entity)'+
            ')');
    }


    insert(sql, params){
        this.db.run(sql,params, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Rows inserted ${this.changes}`);
        });
    }


    close(){
        this.db.close();
    }
}

const instance = new SQLConnectivity();

module.exports = SQLConnectivity;