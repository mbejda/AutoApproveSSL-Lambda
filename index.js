const childProcess = require('child_process');
const path = require('path');
const AWS = require('aws-sdk');
const https = require('https');
const url = require('url');
const s3 = new AWS.S3();




exports.handler = (event, context, callback) => {

   /// console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    /**
     * Get the email from the bucket.
     */
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            callback(err);
            return;
        }


            var params = {
                Bucket: bucket,
                Delete: { // required
                    Objects: [ // required
                        {
                            Key: key // required
                        }
                    ],
                },
            };

        /**
         * Get the contents of the email
         */
        var text = data.Body.toString();


        /**
         * Delete the email because we don't need it anymore.
         */
            s3.deleteObjects(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });




        var links = text.match(/\s+at\s+(.*)\s+and\s+/g);
        var main = links[0];

        main = main.replace(/[{()}]/g, '').replace('at', '').replace(/and/g, '').trim();

        /// we are going to authorize this URL


        var processArgs = [
            "./phantom.js",
            encodeURI(main)
        ];



        /// Pass the arguments to phantomjs
        childProcess.execFile("./phantomjs", processArgs, function (error, stdout, stderr) {

            console.log("error ",error)
            console.log("stdout ",stdout)
            console.log("stderr ",stderr)

        });

    });
};










