const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAS3VBSOLOZKLXOVEC', // Set in environment variables
    secretAccessKey: 'P78hbQvRSfWNkqjJUp7tjPwkmh1eN77spj7Pi2/8', // Set in environment variables
    region: 'us-east-1' // Adjust to your S3 bucket's region
});

const s3 = new AWS.S3();
const BUCKET_NAME = 'extralumnos'; // Replace with your bucket name

app.post('/get-signed-url', async (req, res) => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        Expires: 60 // URL valid for 60 seconds
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

        res.json({ signedUrl, publicUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Could not generate signed URL' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
