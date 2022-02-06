module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("pengeluaran", {
      nama_pengeluaran: {
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
      },
      keterangan: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
    });
    return User;
  };