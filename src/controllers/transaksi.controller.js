
const db =require('../models')
const Customer = db.customer;
const Barnag = db.barang;
const Bank = db.banks;
const Ewallet = db.ewallet;
const Transaksi = db.transaksi
var moment = require('moment');
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: transaksi } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, transaksi, totalPages, currentPage };
  };
exports.get_customer = (req, res)=>{
    const {
        nama_customer,
    } = req.query;
    Customer.findAll({
        order: [['nama_customer', 'ASC']],
        where:  { nama_customer: { [Op.like]: `%${nama_customer}%` } }
        
    }).then((result) => {
        const data = result.map(val=>{
            return {
                id: val.id, nama:val.nama_customer, nohp_customer: val.nohp_customer, alamat_customer: val.alamat_customer
            }
        })
        return res.status(200).send(data);
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            message: 'Gagal Mengambil Data'
        })
    });
}
exports.get_barang = (req, res)=>{
    const {
        nama_barang,
    } = req.query;
    Barnag.findAll({
        order: [['nama_barang', 'ASC']],
        where:  { nama_barang: { [Op.like]: `%${nama_barang}%` } }
        
    }).then((result) => {
        const data = result.map(val=>{
            return {
                id:val.id, nama:val.nama_barang, satuan:val.satuan, jumlah:val.jumlah, harga:val.harga
            }
        })
        return res.status(200).send(data);
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            message: 'Gagal Mengambil Data'
        })
    });
}


exports.get_banks = (req, res)=>{
    const {
        nama_bank,
    } = req.query;

    Bank.findAll({
        order: [['nama_akun', 'ASC']],
        where:  { nama_bank: { [Op.like]: `%${nama_bank}%` } }
        
    }).then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            message: 'Gagal Mengambil Data'
        })
    });
}

exports.ewallets = (req, res)=>{
    const {
        nama_wallet,
    } = req.query;
    Ewallet.findAll({
        order: [['nama_wallet', 'ASC']],
        where:  { nama_wallet: { [Op.like]: `%${nama_wallet}%` } }
        
    }).then((result) => {
        return res.status(200).send(result);
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            message: 'Gagal Mengambil Data'
        })
    });
}

exports.post_transaksi = async (req, res) => {

    const { id_barang, idCustomer, payment_methods, date, bank_id, wallet_id, metode_pengiriman, biaya_pengantaran, keterangan, alamat_customer, nama_customer, nohp_customer, jumlah } = req.body
    console.log(date);
    let dates = new Date(date)
    const tanggal = dates.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let formData = {};

    const barangs = await Barnag.findByPk(id_barang);
    const customers = await Customer.findByPk(idCustomer);

    formData.id_barang = id_barang;
    formData.id_customer = idCustomer;
    formData.payment_methods = payment_methods;
    formData.date = tanggal;
    formData.jumlah = jumlah;
    formData.keterangan = keterangan;
    formData.alamat_customer = alamat_customer;
    formData.nama_customer = nama_customer;
    formData.nohp_customer = nohp_customer;
    formData.total_harga = jumlah * barangs.harga;
    formData.metode_pengiriman = metode_pengiriman;

    if(metode_pengiriman === 'di_antar'){
        formData.biaya_pengantaran = biaya_pengantaran;
        formData.total_biaya =  parseInt(jumlah * barangs.harga)  + parseInt(biaya_pengantaran);
    }else {
        formData.total_biaya =  (jumlah * barangs.harga)
    }

    if(payment_methods === 'bank_transfer'){
        formData.bank_id = bank_id;
        formData.wallet_id = null;
    }else if(payment_methods === 'e_wallet'){
        formData.bank_id = null;
        formData.wallet_id = wallet_id;
    }else if(payment_methods === 'cash'){
        formData.bank_id = null;
        formData.wallet_id = null;
    }

    if(customers){
       return Transaksi.create({
            id_barang: formData.id_barang,
            id_customer: formData.id_customer,
            payment_methods: formData.payment_methods,
            date: formData.date,
            bank_id: formData.bank_id,
            wallet_id: formData.wallet_id,
            jumlah: formData.jumlah,
            total_harga: formData.total_harga,
            total_biaya: formData.total_biaya,
            metode_pengiriman: formData.metode_pengiriman,
            biaya_pengantaran: formData.biaya_pengantaran,
            keterangan: formData.keterangan,
        }).then(result =>{
            return res.status(200).send(result)
        })
    }else {
        return Customer.create({
            nama_customer: formData.nama_customer,
            nohp_customer: formData.nohp_customer,
            alamat_customer: formData.alamat_customer
        }).then(cus=>{
            return cus.id
        }).then(id =>{
            return Transaksi.create({
                id_barang: formData.id_barang,
                id_customer: id,
                payment_methods: formData.payment_methods,
                date: formData.date,
                bank_id: formData.bank_id,
                wallet_id: formData.wallet_id,
                jumlah: formData.jumlah,
                total_harga: formData.total_harga,
                total_biaya: formData.total_biaya,
                metode_pengiriman: formData.metode_pengiriman,
                biaya_pengantaran: formData.biaya_pengantaran,
                keterangan: formData.keterangan,
                status: 'belum_bayar'
            })
        }).then(result =>{
            return res.status(200).send(result)
        })
    }
    

    


}

exports.detail_transaksi = (req, res) =>{
    const {id} = req.params;
    Bank.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Bank, {foreignKey: 'bank_id'});
    Customer.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Customer, {foreignKey: 'id_customer'})
    Barnag.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Barnag, {foreignKey: 'id_barang'})
    Ewallet.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Ewallet, {foreignKey: 'wallet_id'})

    Transaksi.findAll({
        include: [Bank, Customer, Barnag, Ewallet],
        where: {
            id: id
        }
    }).then(result=>{
        console.log('result', result, id);
        return res.status(200).send(result[0])
    }).catch(err=>{
        console.log(err);
    })
}

exports.get_transaksi = (req, res) =>{
    const { page=0, size=15, nama_customer } = req.query;
    var condition = nama_customer ? { nama_customer: { [Op.like]: `%${nama_customer}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Bank.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Bank, {foreignKey: 'bank_id'});
    Customer.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Customer, {foreignKey: 'id_customer'})
    Barnag.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Barnag, {foreignKey: 'id_barang'})
    Ewallet.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Ewallet, {foreignKey: 'wallet_id'})

    Transaksi.findAndCountAll(
        {include: [Bank, {
            model: Customer,
            where: condition
        }, Barnag, Ewallet],
        limit, offset}).then((result) => {
        console.log('result', result);
        const response = getPagingData(result, page, limit);
        return res.status(200).send(response);
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list Pengeluaran',
            data: null
        });
    });
}

exports.change_status = (req, res) => {
    const {id} = req.params
    Transaksi.update({
        status: 'lunas'
    }, {
        returning: true,
        where: {
            id: id
        }
    }).then(result=>{
        return res.status(200).send({
            message: 'Berhasil',
            data: result
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Error',
            data: null
        });
    });
}

exports.delete = (req, res) => {
    const {id} = req.params
    Transaksi.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus',
            data: null
        });
    });
}

exports.update = async (req, res) => {
    const {id} = req.params
    const { id_barang, idCustomer, payment_methods, date, bank_id, wallet_id, metode_pengiriman, biaya_pengantaran, keterangan, alamat_customer, nama_customer, nohp_customer, jumlah } = req.body
    console.log(date);
    let dates = new Date(date)
    const tanggal = dates.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let formData = {};

    const barangs = await Barnag.findByPk(id_barang);
    const customers = await Customer.findByPk(idCustomer);

    formData.id_barang = id_barang;
    formData.id_customer = idCustomer;
    formData.payment_methods = payment_methods;
    formData.date = tanggal;
    formData.jumlah = jumlah;
    formData.keterangan = keterangan;
    formData.alamat_customer = alamat_customer;
    formData.nama_customer = nama_customer;
    formData.nohp_customer = nohp_customer;
    formData.total_harga = jumlah * barangs.harga;
    formData.metode_pengiriman = metode_pengiriman;

    if(metode_pengiriman === 'di_antar'){
        formData.biaya_pengantaran = biaya_pengantaran;
        formData.total_biaya =  parseInt(jumlah * barangs.harga)  + parseInt(biaya_pengantaran);
    }else {
        formData.total_biaya =  (jumlah * barangs.harga)
    }

    if(payment_methods === 'bank_transfer'){
        formData.bank_id = bank_id;
        formData.wallet_id = null;
    }else if(payment_methods === 'e_wallet'){
        formData.bank_id = null;
        formData.wallet_id = wallet_id;
    }else if(payment_methods === 'cash'){
        formData.bank_id = null;
        formData.wallet_id = null;
    }

    if(customers){
       return Transaksi.update({
            id_barang: formData.id_barang,
            id_customer: formData.id_customer,
            payment_methods: formData.payment_methods,
            date: formData.date,
            bank_id: formData.bank_id,
            wallet_id: formData.wallet_id,
            jumlah: formData.jumlah,
            total_harga: formData.total_harga,
            total_biaya: formData.total_biaya,
            metode_pengiriman: formData.metode_pengiriman,
            biaya_pengantaran: formData.biaya_pengantaran,
            keterangan: formData.keterangan,
        }, {
            returning:true,
            where: {
                id:id
            }
        }).then(result =>{
            return res.status(200).send(result)
        })
    }else {
        return Customer.create({
            nama_customer: formData.nama_customer,
            nohp_customer: formData.nohp_customer,
            alamat_customer: formData.alamat_customer
        }).then(cus=>{
            return cus.id
        }).then(id =>{
            return Transaksi.update({
                id_barang: formData.id_barang,
                id_customer: id,
                payment_methods: formData.payment_methods,
                date: formData.date,
                bank_id: formData.bank_id,
                wallet_id: formData.wallet_id,
                jumlah: formData.jumlah,
                total_harga: formData.total_harga,
                total_biaya: formData.total_biaya,
                metode_pengiriman: formData.metode_pengiriman,
                biaya_pengantaran: formData.biaya_pengantaran,
                keterangan: formData.keterangan,
                status: 'belum_bayar'
            }, {
                returning:true,
                where: {
                    id:id
                }
            })
        }).then(result =>{
            return res.status(200).send(result)
        })
    }
    

    


}