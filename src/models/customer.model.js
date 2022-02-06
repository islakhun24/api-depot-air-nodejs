module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("customer", {
      nama_customer: {
        type: Sequelize.STRING
      },
      nohp_customer: {
        type: Sequelize.STRING
      },
      alamat_customer: {
        type: Sequelize.STRING
      }
    });
    return User;
  };