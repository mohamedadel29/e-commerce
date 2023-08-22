const fs = require('fs');
const { MongoClient } = require('mongodb');
// Database and collection names
const databaseName = 'e-commerce';
//const collectionName = 'orders';

// Output file path
const outputFile = 'output.json';

// Output directory path
const outputDirectory = 'data';

exports.exportdb= async (req, res) => {
    const client = new MongoClient(process.env.DB_URL);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
    
        const database = client.db(databaseName);
        const collections = await database.listCollections({}, { nameOnly: true }).toArray();
    
        for (const collection of collections) {
          const collectionName = collection.name;
    
          const cursor = database.collection(collectionName).find();
          const documents = await cursor.toArray();
          const json = JSON.stringify(documents, null, 2);
    
          const outputFile = `${outputDirectory}/${collectionName}.json`;
          fs.writeFileSync(outputFile, json);
    
          console.log(`Exported ${documents.length} documents to ${outputFile}`);
        }
    
        res.status(200).send('Export completed');
      } catch (error) {
        console.error('Error exporting database:', error);
        res.status(500).send('Error exporting database');
      }
};

