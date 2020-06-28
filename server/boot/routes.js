'use strict';

module.exports = function(app) {
  var router = app.loopback.Router();
  // configure the keys for accessing AWS
  const AWS = require('aws-sdk');
  const bluebird = require('bluebird');
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // configure AWS to work with promises
  AWS.config.setPromisesDependency(bluebird);

  // create S3 instance
  const s3 = new AWS.S3();

  app.post('/api/signed-url', (req, res) => {
    console.log('--------------------------------------------------')
    const params = {
      'Bucket': process.env.S3_BUCKET,
      'Key': req.body.fileName,
      'ContentType': req.body.fileType,
    };
    console.log(params);

    s3.getSignedUrl('putObject', params, (err, data) => {
      if (err) return res.status(500).json({'success': false, 'error': err});

      var payload = {
        'name': params.Key,
      };

      app.models.fileUpload.create(payload, function(err, doc) {
        if (err) return res.status(500).json({'error': err.message});
        return res.status(200).json({'success': true, 'url': data, 'doc': doc, 'bucket': process.env.S3_BUCKET});
      });
    });
  });

  app.get('/api/get-files', (req, res) => {
    app.models.fileUpload.find({}, function(err, docs) {
      if (err) return res.status(500).json({'error': err.message});
      return res.status(200).json({'success': true, 'data': docs, 'bucket': process.env.S3_BUCKET});
    });
  });

  app.post('/api/get-file', (req, res) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: req.body.fileName, //the directory in S3
    };

    s3.getSignedUrl('getObject', params, function(err, data) {
      if (err) {
        res.status(500).json({'success': false, 'error': err});
      } else {
        res.status(200).json({'success': true, 'data': data});
      }
    });
  });
  app.use(router);
};

