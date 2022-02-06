module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("barang", {
      nama_barang: {
        type: Sequelize.STRING
      },
      satuan: {
        type: Sequelize.STRING
      },
      jumlah: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.STRING
      }
    });
    return User;
  };