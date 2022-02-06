module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("transaksi", {
      id_barang: {
        type: Sequelize.STRING
      },
      id_customer: {
        type: Sequelize.STRING
      },
      payment_methods: {
        type: Sequelize.ENUM,
        values: ['cash', 'e_wallet', 'bank_transfer', 'virtual_account']
      },
      date: {
        type: Sequelize.STRING
      },
      bank_id: {
        type: Sequelize.STRING
      },
      wallet_id: {
        type: Sequelize.STRING
      },
      jumlah: {
        type: Sequelize.STRING
      },
      total_harga: {
        type: Sequelize.STRING
      },
      metode_pengiriman: {
        type: Sequelize.ENUM,
        values: ['diantar', 'tidak']
      },
      biaya_pengantaran: {
        type: Sequelize.ENUM,
        values: ['diantar', 'tidak']
      },
      keterangan: {
        type: Sequelize.STRING
      },
    });
    return User;
  };