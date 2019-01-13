const path = require('path');

module.exports = {
   name: '',
   user: '',
   password: '',   
   dialect: 'sqlite',
   host: 'localhost',
   port: '',
   storage: path.join(__dirname,'../../database/save.sqlite')
}