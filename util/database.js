const Sequelize = require('sequelize');

//the below will setup connection pool

const sequelize = new Sequelize('node-complete','root','',
    {
        dialect:'mysql',
        host: 'localhost'
    }
)
module.exports = sequelize;

//the config for connectn via mysql2
// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: ''
// });

// module.exports = pool.promise();
