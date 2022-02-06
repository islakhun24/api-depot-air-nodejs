module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("ewallet", {
      nama_wallet: {
        type: Sequelize.STRING
      },
      nomor_hp: {
        type: Sequelize.STRING
      },
      qr_code: {
        type: Sequelize.STRING
      }
    });
    return User;
  };