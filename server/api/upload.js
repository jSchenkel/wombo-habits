import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: Meteor.settings.private.accessKeyId,
  secretAccessKey: Meteor.settings.private.secretAccessKey,
  region: 'us-east-1'
});

Meteor.methods({
  getSignedUploadUrl(fileType) {

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      fileType: {
        type: String
      }
    }).validate({ fileType });

    // fileType = "image/{fileExtension}"
    const fileExtension = fileType.split('/')[1];

    const newId = shortid.generate();
    // const Key = `${userId}/${newId}.${fileType}`;
    // in the future can use the file type of the uploaded file and customize key and content type below
    // have to parse image/jpeg for the key, and make sure image is first element (split on /)
    const key = `${this.userId}/${newId}.${fileExtension}`;

    // synchronous call for signed url
    const url = s3.getSignedUrl('putObject', {
      Bucket: 'wombo-campaigns',
      // ContentType: "image/{fileExtension}",
      ContentType: fileType,
      Key: key
    });

    const response = {
      key,
      url
    };

    return response;
  },
  deleteObject(key) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      key: {
        type: String
      }
    }).validate({ key });

    const params = {
      Bucket: 'wombo-campaigns',
      Key: key
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        // console.log('deleteObject err: ', err, err.stack); // an error occurred
      } else {
        // console.log('deleteObject success: ', data);           // successful response
      }
    });
  }
});
