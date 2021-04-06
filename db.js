

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}
class Sessions extends Model {}

User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING
}, { sequelize, modelName: 'user' });

Sessions.init({
    username: DataTypes.STRING,
    SID: DataTypes.STRING,
    session_login: DataTypes.DATE,
    session_logout: DataTypes.DATE
  }, { sequelize, modelName: 'session' });

(async () => {
    await sequelize.sync()
})()

let models = {
    User: User,
    Sessions : Sessions
}

module.exports = models