const db =require('../models')
const Pengeluaran = db.pengeluaran;
var moment = require('moment');
exports.create_pengeluaran = (req, res)=>{
    const {
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date,

   } = req.body;

   Pengeluaran.create({
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date,
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Pengeluaran'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Pengeluaran'
        })
    });
}

exports.update_pengeluaran = (req, res)=>{
    const {id} = req.params;
    const {
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date,
    } = req.body;

    Pengeluaran.update({
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date,
    },{
        returning: true, 
        where: {id:id}
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Pengeluaran'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Pengeluaran'
        })
    });
}

exports.list_pengeluaran = (req, res)=>{
    Pengeluaran.findAll().then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan list Pengeluaran',
            data: result.map(val=>{
                return {
                    id: val.id,
                    nama_pengeluaran: val.nama_pengeluaran,
                    satuan: val.satuan,
                    jumlah: val.jumlah,
                    harga: val.harga,
                    keterangan: val.keterangan,
                    date: moment(val.date).format('DD-MM-YYYY'),
                }
            })
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list Pengeluaran',
            data: null
        });
    });
}

exports.delete_pengeluaran = (req, res)=>{
    const {id} = req.params
    Pengeluaran.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus Pengeluaran'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus Pengeluaran',
            data: null
        });
    });
}

exports.detail_pengeluaran = (req, res)=>{
    const {id} = req.params
    Pengeluaran.findByPk(id).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan Pengeluaran',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal menampilkan Pengeluaran',
            data: null
        });
    });
}