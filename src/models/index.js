const dbConfig = require("../configs/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.banks = require("./banks.model.js")(sequelize, Sequelize);
db.barang = require("./barang.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.ewallet = require("./e_wallet.model")(sequelize, Sequelize);
db.pengeluaran = require("./pengeluarans.model")(sequelize, Sequelize);
db.transaksi = require("./transaksi.model")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
module.exports = db;