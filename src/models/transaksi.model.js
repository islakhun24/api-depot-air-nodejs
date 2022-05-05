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
        type: Sequelize.DATE
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
        values: ['di_antar', 'ambil_sendiri']
      },
      biaya_pengantaran: {
        type: Sequelize.STRING
      },
      total_biaya: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ['belum_bayar', 'lunas']
      },
    });
    return User;
  };