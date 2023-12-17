const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('license', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('ConnectDB MYSQL Successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectDB();
