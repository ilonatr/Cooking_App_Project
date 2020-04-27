'use strict';
//const pool = require('../database/db');
const promisePool = require('../database/db').promise();

const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT id, username, name, email FROM users');
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getUser = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT id, username, name, email, avatar FROM users WHERE id = ?', [ id ]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
  }
};

const insertUser = async (user) => {
  try {
    console.log('insert user?', user);
    const [rows] = await promisePool.query('INSERT INTO users (username, password, name, email, avatar) VALUES (?, ?, ?, ?, ?)', [ user.username, user.password, user.name, user.email, user.avatar ]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const updateUser = async (user) => {
  try {
    console.log('insert user?', user);
    const [rows] = await promisePool.query('UPDATE users SET username = ?, name = ?, email = ?, password = ?, avatar = ? WHERE id = ?', [user.username, user.name, user.email, user.password, user.avatar, user.id ]);
    return rows;
  } catch (e) {
    console.error('updateUser model crash', e.message);
  }
};

const deleteUser = async (id) => {
  try {
    console.log('delete user', id);
    const [rows] = await promisePool.query('DELETE FROM users WHERE id = ?', [ id ]);
    console.log('deleted?', rows);
    return rows;
  } catch (e) {
    console.error('deleteUser model', e.message);
  }
}

module.exports = {
  getAllUsers,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};

