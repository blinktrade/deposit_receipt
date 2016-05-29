var gcloud = require('gcloud');

// The following environment variables are set by app.yaml when running on GAE,
// but will need to be manually set when running locally.
// The storage client is used to communicate with Google Cloud Storage
var storage = gcloud.storage({
  projectId: process.env.GCLOUD_PROJECT
});

// A bucket is a container for objects (files).
var bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

module.exports = bucket;
