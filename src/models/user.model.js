module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      nama_perusahaan: {
        type: Sequelize.STRING
      },
      alamat_perusahaan: {
        type: Sequelize.TEXT
      },
      nohp_perusahaan: {
        type: Sequelize.STRING
      },
      logo_perusahaan: {
        type: Sequelize.TEXT
      }
    });
    return User;
  };