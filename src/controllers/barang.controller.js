const db =require('../models')
const Barang = db.barang;

exports.create_barang = (req, res)=>{
    const {
        nama_barang,
        satuan,
        jumlah,
        harga

   } = req.body;

    Barang.create({
        nama_barang,
        satuan,
        jumlah,
        harga
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Barang'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Barang'
        })
    });
}

exports.update_barang = (req, res)=>{
    const {id} = req.params;
    const {
        nama_barang,
        satuan,
        jumlah,
        harga
    } = req.body;

    Barang.update({
        nama_barang,
        satuan,
        jumlah,
        harga
    },{
        returning: true, 
        where: {id:id}
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Barang'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Barang'
        })
    });
}

exports.list_barang = (req, res)=>{
    Barang.findAll().then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan list Barang',
            data: result
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list Barang',
            data: null
        });
    });
}

exports.delete_barang = (req, res)=>{
    const {id} = req.params
    Barang.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus Barang'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus Barang',
            data: null
        });
    });
}

exports.detail_barang = (req, res)=>{
    const {id} = req.params
    Barang.findByPk(id).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan Barang',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal menampilkan Barang',
            data: null
        });
    });
}