'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({
    origin: true,
});

exports.sendToTopic = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {

        const mtitle = req.body.title;
        const mcontent = req.body.content;

        const payload = {
            notification: {
                title: mtitle,
                body: mcontent
            }
        };
        console.log(mtitle);
        console.log(mcontent);
        admin.messaging().sendToTopic('event', payload);
        res.status(200).send({
            'status': 'Done'
        });
    });
});

exports.sendToDevice = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
		
		const mtoken = req.body.token;
        const mtitle = req.body.title;
        const mcontent = req.body.content;

        const payload = {
            notification: {
                title: mtitle,
                body: mcontent
            }
        };
		console.log(mtoken);
        console.log(mtitle);
        console.log(mcontent);
        admin.messaging().sendToDevice(mtoken, payload);
        res.status(200).send({
            'status': 'Done'
        });
    });
});