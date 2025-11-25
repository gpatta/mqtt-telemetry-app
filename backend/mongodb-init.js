// mongodb-init.js

db = db.getSiblingDB('mydb'); 


// Create a new user for "mydb" with read/write access
//! For test purposes only, to remove plaintext password field
db.createUser({
    user: "gpatta",
    pwd: "yZxurK59VUX4e2zQ",
    roles: [{ role: "readWrite", db: "mydb" }]
});


// Create the "users" collection
db.createCollection("users");

// Insert default users into the "users" collection
//! For test purposes only, to remove plaintext password field
db.users.insertMany([
  {
    "username": "admin",
    "email": "admin@example.com",
    "password": "gtj5KZNo5EfmT6zr",
    "role": "admin"
  },
  {
    "username": "user",
    "email": "user@example.com",
    "password": "PaEs27UWuUzYHHjj",
    "role": "user"
  }
]);


// Create the "users" collection
db.createCollection("owners");

// Insert default users into the "users" collection
db.owners.insertMany([
  {
    "name": "Company A",
    "nickname": "a"
  },
  {
    "name": "Company B",
    "nickname": "b"
  },
  {
    "name": "Company C",
    "nickname": "c"
  }
]);


// Create the "data" collection
db.createCollection("data");
