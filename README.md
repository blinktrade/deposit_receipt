# BlinkTrade Deposit Receipt

BlinkTrade upload deposit receipts on Google Cloud AppEngine.

## Google Cloud Setup

Before you can run or deploy the sample, you will need to do the following:

1. Enable the Cloud Storage API in the [Google Developers Console](https://console.developers.google.com/project/_/apiui/apiview/storage/overview).

2. Create a Cloud Storage Bucket. You can do this with the [Google Cloud SDK](https://cloud.google.com/sdk)
with the following command:

        $ gsutil mb gs://<your-bucket-name>

3. Set the default ACL on your bucket to public read in order to serve files
directly from Cloud Storage. You can do this with the [Google Cloud SDK](https://cloud.google.com/sdk)
with the following command:

        $ gsutil defacl set public-read gs://<your-bucket-name>

## Running locally

Then set environment variables before starting your application:

    export GCLOUD_PROJECT=<your-project-id>
    export GCLOUD_STORAGE_BUCKET=<your-bucket-name>

    $ npm install
    $ npm start

Watching changes

    $ npm run watch

## Deploy on app engine

Make sure to set the `GCLOUD_PROJECT` and `GCLOUD_STORAGE_BUCKET` on `app.yaml` file

    $ npm run deploy

# TODO

* Detect exif images fraud

# License
BlinkTrade INC 2016 - [GNU GPL v3](./LICENSE)
