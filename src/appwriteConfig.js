import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('6675418900252afb89ab'); // Your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
