'use strict';
const photoModel = require('../models/photoModel');
const makeThumbnail = require('../utils/resize').makeThumbnail;
const imageMeta = require('../utils/imageMeta');

const photos = photoModel.photos;

const photo_list_get = async (req, res) => {
    console.log('rivi 7', req.user);
    const photos = await photoModel.getAllPhotos(req.user.id);
    res.json(photos);
};

const photo_get = async (req, res) => {
    console.log('photo id parameter', req.params);
    const photo = await photoModel.getPhoto(req.params.id);
    res.json(photo);
};

const photo_post = async (req, res) => {
    try {
        console.log('photo_post', req.body, req.file);

        const thumb = await makeThumbnail(req.file.path, './thumbnails'+req.file.filename);
        console.log(thumb);

        const coords = await imageMeta.getCoordinates(req.file.path);
        console.log('coords', coords);

        const params = [
            req.file.filename,
            req.body.owner,
            req.body.caption,
            coords,
        ];
        const photo = await photoModel.insertPhoto(params);
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
    res.status(200).json({ message: 'OK' });
};

const photo_delete = async (req, res) => {
    console.log('photo_put', req.params);
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
