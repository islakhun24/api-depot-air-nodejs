
const db =require('../models')
const Customer = db.customer;
const Barnag = db.barang;
const Bank = db.banks;
const Ewallet = db.ewallet;
const Transaksi = db.transaksi
var moment = require('moment');
const excel = require("exceljs");
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
    const { page=0, size=15, nama_customer, toDate, fromDate } = req.body;
    console.log(req.body);
    var condition = nama_customer ? { nama_customer: { [Op.like]: `%${nama_customer}%` } } : null;
    var conditionDate = fromDate && toDate ? {date : {
        [Op.between]: [new Date(fromDate.toString()+"T00:00:00").toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }), new Date(toDate.toString()+"T23:59:59").toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })]
    }}:null
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
        {
            where: conditionDate,
            include: [Bank, {
            model: Customer,
            where: condition
        }, Barnag, Ewallet],
        limit, offset}).then((result) => {
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
exports.download = (req, res) => {
    const { toDate, fromDate } = req.body;
    var conditionDate = fromDate && toDate ? {date : {
        [Op.between]: [new Date(fromDate.toString()+"T00:00:00").toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }), new Date(toDate.toString()+"T23:59:59").toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })]
    }}:null
    Bank.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Bank, {foreignKey: 'bank_id'});
    Customer.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Customer, {foreignKey: 'id_customer'})
    Barnag.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Barnag, {foreignKey: 'id_barang'})
    Ewallet.hasMany(Transaksi, {foreignKey: 'id'});
    Transaksi.belongsTo(Ewallet, {foreignKey: 'wallet_id'})

    Transaksi.findAll(
        {
            where: conditionDate,
            include: [Bank, Customer, Barnag, Ewallet]}).then((result) => {
                let transaksi = [];
                result.forEach((obj) => {
                    let object = {};

                    object.date = obj.date ? (obj.date.toISOString()).split("T")[0] : "-";
                    object.jumlah = obj.jumlah;
                    object.total_harga= obj.total_harga;
                    object.total_harga= obj.total_harga;
                    object.total_biaya= obj.total_biaya;
                    object.status= obj.status;

                    object.nama_customer= obj.customer.nama_customer;
                    object.nohp_customer= obj.customer.nohp_customer;
                    object.alamat_customer= obj.customer.alamat_customer;

                    object.nama_barang= obj.barang.nama_barang;
                    object.satuan= obj.barang.satuan;
                    object.jumlah_barang= obj.barang.jumlah;
                    object.harga_barang= obj.barang.harga;
                    object.keterangan= obj.barang.keterangan;
                    if(obj.payment_methods === 'bank_transfer'){
                        object.payment_methods="Bank Transfer";
                        object.nama_akun= obj.bank.nama_bank;
                        object.pemilik_akun= obj.bank.nama_akun;
                        object.nomor_akun= obj.bank.nomor_rekening;
                    }else if(obj.payment_methods === 'e_wallet'){
                        object.payment_methods= "E-Wallet";
                        object.nama_akun= obj.wallet.nama_wallet;
                        object.pemilik_akun= "-";
                        object.nomor_akun= obj.wallet.nomor_hp;
                    }else if(obj.payment_methods === 'cash'){
                        object.payment_methods= "Cash";
                        object.pemilik_akun = "-";
                        object.nomor_akun = "-";
                        object.nama_akun = "-";
                    }

                    if(obj.metode_pengiriman === 'di_antar'){
                        object.metode_pengiriman= "Di Antar";
                        object.biaya_pengantaran= obj.biaya_pengantaran;
                    } else if(obj.metode_pengiriman === 'ambil_sendiri'){
                        object.metode_pengiriman= "Ambil Sendiri";
                        object.biaya_pengantaran= "-";
                    }else {
                        object.metode_pengiriman= "";
                        object.biaya_pengantaran= "-";
                    }

                    transaksi.push(object);
                });
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Pengeluaran");
            worksheet.getCell('A1').font = { bold: true };
            worksheet.getCell('B1').font = { bold: true };
            worksheet.getCell('C1').font = { bold: true };
            worksheet.getCell('D1').font = { bold: true };
            worksheet.getCell('E1').font = { bold: true };
            worksheet.getCell('F1').font = { bold: true };
            worksheet.getCell('G1').font = { bold: true };
            worksheet.getCell('H1').font = { bold: true };
            worksheet.getCell('I1').font = { bold: true };
            worksheet.getCell('J1').font = { bold: true };
            worksheet.getCell('K1').font = { bold: true };
            worksheet.getCell('L1').font = { bold: true };
            worksheet.getCell('M1').font = { bold: true };
            worksheet.getCell('N1').font = { bold: true };
            worksheet.getCell('E1').fill = { 
                    type: 'pattern',
                    pattern:'solid',
                    fgColor:{ argb:'cccccc' }
                };
            worksheet.getCell('F1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('D1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('C1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('B1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            }; 
            worksheet.getCell('A1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('G1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('H1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('I1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('J1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('K1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            }; 
            worksheet.getCell('L1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('M1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            };
            worksheet.getCell('N1').fill = { 
                type: 'pattern',
                pattern:'solid',
                fgColor:{ argb:'cccccc' }
            }; 
                worksheet.getRow(1).height = 20;
                worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.columns = [
                { header: "Tanggal", key: "date", width: 20 },
                { header: "Nama Customer", key: "nama_customer", width: 20 },
                { header: "No Hp", key: "nohp_customer", width: 20 },
                { header: "Alamat", key: "alamat_customer", width: 30 },
                { header: "Nama Barang", key: "nama_barang", width: 20 },
                { header: "Satuan", key: "satuan", width: 10 },
                { header: "Harga Barang", key: "harga_barang", width: 20 },
                { header: "Pembayaran", key: "payment_methods", width: 20 },
                { header: "Nama Akun", key: "nama_akun", width: 20 },
                { header: "Pemilik", key: "pemilik_akun", width: 20 },
                { header: "Nomor Akun", key: "nomor_akun", width: 20 },
                { header: "Pengiriman", key: "metode_pengiriman", width: 20 },
                { header: "Biaya Pengantaran", key: "biaya_pengantaran", width: 20 },

                { header: "Keterangan", key: "keterangan", width: 50 },
            ];
            // // Add Array Rows
            worksheet.addRows(transaksi);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "transaksi.xlsx"
            );
                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            // return res.send(transaksi)
            });
        
  };