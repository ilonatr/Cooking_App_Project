'use strict';
//const pool = require('../database/db');
const promisePool = require('../database/db').promise();

const getAllPhotos = async (uid) => {
  try {
    const [rows] = await promisePool.query('SELECT photo.id, filename, owner, caption, timestamp, users.id AS user_id, users.name AS ownername FROM photo LEFT JOIN users ON owner = users.id');
    rows.map((row) => {
      if (uid == row.user_id) {
        row.editable = true
      }
     })

    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getPhoto = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM photo WHERE photo.id = ?', [ id ]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
  }
};

const insertPhoto = async (photo) => {
  try {
    console.log('insert photo?', photo);
    const [rows] = await promisePool.query('INSERT INTO photo (filename, owner, caption) VALUES (?, ?, ?)', [ photo.filename, photo.owner, photo.caption]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const updatePhoto = async (photo) => {
  try {
    console.log('insert photo?', photo);
    const [rows] = await promisePool.query('UPDATE photo SET caption = ? WHERE photo.id = ?', [ photo.caption, photo.id ]);
    return rows;
  } catch (e) {
    console.error('updatePhoto model crash', e.message);
  }
};

const deletePhoto = async (id) => {
  try {
    console.log('delete photo', id);
    const [rows] = await promisePool.query('DELETE FROM photo WHERE photo.id = ?', [ id ]);
    console.log('deleted?', rows);
    return rows;
  } catch (e) {
    console.error('deletePhoto model', e.message);
  }
}

module.exports = {
  getAllPhotos,
  getPhoto,
  insertPhoto,
  updatePhoto,
  deletePhoto,
};

