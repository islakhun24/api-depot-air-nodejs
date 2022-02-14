const db =require('../models')
const Customer = db.customer;

exports.create_customer = (req, res)=>{
    const {
        nama_customer,
        nohp_customer,
        alamat_customer

   } = req.body;

   Customer.create({
        nama_customer,
        nohp_customer,
        alamat_customer
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Customer'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Customer'
        })
    });
}

exports.update_customer = (req, res)=>{
    const {id} = req.params;
    const {
        nama_customer,
        nohp_customer,
        alamat_customer
    } = req.body;

    Customer.update({
        nama_customer,
        nohp_customer,
        alamat_customer
    },{
        returning: true, 
        where: {id:id}
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Customer'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Customer'
        })
    });
}

exports.list_customer = (req, res)=>{
    Customer.findAll().then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan list Customer',
            data: result
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list Customer',
            data: null
        });
    });
}

exports.delete_customer = (req, res)=>{
    const {id} = req.params
    Customer.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus Customer'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus Customer',
            data: null
        });
    });
}

exports.detail_customer = (req, res)=>{
    const {id} = req.params
    Customer.findByPk(id).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan Customer',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal menampilkan Customer',
            data: null
        });
    });
}