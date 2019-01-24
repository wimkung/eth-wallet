const mongoose = require('mongoose');

module.exports = async () => {
  let dbOptions = {
    user: process.env.MONGODB_USER || '',
    pass: process.env.MONGODB_PASS || '',
    authSource: 'admin',
    useNewUrlParser: true
  };

  const DB = process.env.DB_NAME;
  const URI = `${process.env.MONGODB_URI}/${DB}`;

  mongoose.connect(
    URI,
    dbOptions
  );

  // if (process.env.NODE_ENV !== 'production') {
  //   mongoose.set('debug', true);
  // }

  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );

  mongoose.connection.once('open', () => {
    console.log('mongodb has been connected .');
  });

  await mongoose.connection.startSession();
};
