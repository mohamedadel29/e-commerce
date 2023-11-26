const fs = require('fs');
const { MongoClient } = require('mongodb');

// Output directory path
const outputDirectory = 'data';

exports.exportUserDB = async (req, res) => {
  const uri = `${process.env.DB_URL}`;
  const databaseName = 'e-commerce';
  const collectionName = 'orders';

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const cursor = collection.find();

    const documents = await cursor.toArray();
    const json = JSON.stringify(documents, null, 2);

    const outputFile = `${outputDirectory}/${collectionName}.json`;
    fs.writeFileSync(outputFile, json);
    console.log(`Exported ${documents.length} documents to ${outputFile}`);

    res.send(`Exported ${documents.length} documents to ${outputFile}`);
  } catch (error) {
    console.error('Error exporting order database:', error);
    res.status(500).send('Error exporting order database');
  }}
