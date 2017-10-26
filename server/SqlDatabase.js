// @flow

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'simon',
  database: 'couples_diary',
  // unix socket
  port: '/run/mysqld/mysqld.sock',
});

const getConnection = () => pool.getConnection();
// use a single connection for
export default getConnection;
