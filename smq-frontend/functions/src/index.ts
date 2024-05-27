import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';

admin.initializeApp();

const storage = new Storage();
const bucketName = 'smqf-7cd0f.appspot.com';

export const setCorsConfiguration = functions.https.onRequest(async (req, res) => {
    const corsConfiguration = [
        {
            origin: ["http://localhost:8000"],
            method: ["GET", "HEAD", "PUT", "POST", "DELETE"],
            responseHeader: ["Content-Type"],
            maxAgeSeconds: 3600
        }
    ];

    try {
        await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
        res.status(200).send('CORS configuration set successfully');
    } catch (error) {
        console.error('Error setting CORS configuration:', error);
        res.status(500).send('Failed to set CORS configuration');
    }
});
