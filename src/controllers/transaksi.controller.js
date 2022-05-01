
const db =require('../models')
const Customer = db.customer;
const Barnag = db.barang;
const Bank = db.banks;
const Ewallet = db.ewallet;
const Transaksi = db.transaksi
var moment = require('moment');
const Op = db.op;

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
    const frontEndResponse = {
        "id_barang": 4,
        "idCustomer": 1,
        "payment_methods": "bank_transfer",
        "date": "2022-05-01T09:46:02.000Z",
        "bank_id": 5, // IF BANK TRANSFER
        "wallet_id": 4, // IF E-WALLET
        "metode_pengiriman": "ambil_sendiri",
        "biaya_pengantaran": "30000", // IF DIANTAR
        "keterangan": "coba aja",
        "alamat_customer": " Jakarta",
        "nama_customer": " John Doe",
        "nohp_customer": " 0813948291831",
        "jumlah": "20000", 
        "jumlah_uang": "20000" // IF CASH
    }

    const { id_barang, idCustomer, payment_methods, date, bank_id, wallet_id, metode_pengiriman, biaya_pengantaran, keterangan, alamat_customer, nama_customer, nohp_customer, jumlah, jumlah_uang } = req.body
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
    }

    if(payment_methods === 'bank_transfer'){
        formData.bank_id = bank_id;
        formData.wallet_id = null;
        formData.jumlah_uang = null;
    }else if(payment_methods === 'e_wallet'){
        formData.bank_id = null;
        formData.wallet_id = wallet_id;
        formData.jumlah_uang = null;
    }else if(payment_methods === 'cash'){
        formData.bank_id = null;
        formData.wallet_id = null;
        formData.jumlah_uang = jumlah_uang;
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
            jumlah_uang: formData.jumlah_uang,
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
                jumlah_uang: formData.jumlah_uang,
                metode_pengiriman: formData.metode_pengiriman,
                biaya_pengantaran: formData.biaya_pengantaran,
                keterangan: formData.keterangan,
            })
        }).then(result =>{
            return res.status(200).send(result)
        })
    }
    

    


}