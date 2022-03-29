const mongoose = require('mongoose');
// from here mongoose connection is exported to server.js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/deep-thoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports = mongoose.connection;
