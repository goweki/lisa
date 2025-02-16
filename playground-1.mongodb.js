// Query all databases in the cluster
// db.adminCommand({ listDatabases: 1 });
// print("Databases:", JSON.stringify(databases, null, 2));

// Switch to lisa-test database
use("lisa-test");

// List all collections in lisa-test
// db.getCollectionNames();

// Query all documents in the collection
db.institutions.find({});

// db.institution.updateMany(
//   { $or: [{ createdAt: null }, { createdAt: { $exists: false } }] },
//   { $set: { createdAt: new Date() } }
// );
