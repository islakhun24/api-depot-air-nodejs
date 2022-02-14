const db =require('../models')
const Ewallet = db.ewallet;

exports.create_ewallet = (req, res)=>{
    const {
        nama_wallet, nomor_hp, qr_code

   } = req.body;

   Ewallet.create({
        nama_wallet, nomor_hp, qr_code
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Ewallet'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Ewallet'
        })
    });
}

exports.update_ewallet = (req, res)=>{
    const {id} = req.params;
    const {
        nama_wallet, nomor_hp, qr_code
    } = req.body;

    Ewallet.update({
        nama_wallet, nomor_hp, qr_code
    },{
        returning: true, 
        where: {id:id}
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Ewallet'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Ewallet'
        })
    });
}

exports.list_ewallet = (req, res)=>{
    Ewallet.findAll().then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan list Ewallet',
            data: result
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list Ewallet',
            data: null
        });
    });
}

exports.delete_ewallet = (req, res)=>{
    const {id} = req.params
    Ewallet.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus Ewallet'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus Ewallet',
            data: null
        });
    });
}

exports.detail_ewallet = (req, res)=>{
    const {id} = req.params
    Ewallet.findByPk(id).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan Ewallet',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal menampilkan Ewallet',
            data: null
        });
    });
}