module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("bank", {
      nama_akun: {
        type: Sequelize.STRING
      },
      nomor_rekening: {
        type: Sequelize.STRING
      },
      kode_bank: {
        type: Sequelize.STRING
      },
      nama_bank: {
        type: Sequelize.STRING
      }
    });
    return User;
  };