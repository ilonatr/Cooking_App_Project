'use strict';
const photoModel = require('../models/photoModel');

const photos = photoModel.photos;

const photo_list_get = async (req, res) => {
    const photos = await photoModel.getAllPhotos();
    res.json(photos);
};

const photo_get = async (req, res) => {
    console.log('photo id parameter', req.params);
    const photo = await photoModel.getPhoto(req.params.id);
    res.json(photo);
};

const photo_post = async (req, res) => {
    console.log('photo_post', req.body, req.file);
    const inPhoto = {
        filename: req.file.filename,
        owner: req.body.owner,
        caption: req.body.caption,
    };
    try {
        const photo = await photoModel.insertPhoto(inPhoto);
        console.log('inserted', photo);
        res.send(`added photo: ${photo.insertId}`);
    } catch (e) {
        console.error('problem with photo_post in photoController', e);
        res.status(500).send(`database insert error: ${e.message}`);
    }
};

const photo_put = async (req, res) => {
    console.log('photo_put', req.body);
    const upPhoto = await photoModel.updatePhoto(req.body);
    console.log('photo_put result from db', upPhoto);
    res.status(204).send();
};

const photo_delete = async (req, res) => {
    console.log('photo_put', req.parms);
    const delPhoto = await photoModel.deletePhoto(req.params.id);
    console.log('photo_delete result from db', delPhoto);
    res.json({ deleted: 'OK' });
};

module.exports = {
    photo_list_get,
    photo_get,
    photo_post,
    photo_put,
    photo_delete,
};
