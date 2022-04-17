const db =require('../models')
const Ewallet = db.ewallet;
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: wallet } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, wallet, totalPages, currentPage };
  };
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
    const { page=0, size=15, nama_wallet } = req.query;
    var condition = nama_wallet ? { nama_wallet: { [Op.like]: `%${nama_wallet}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Ewallet.findAndCountAll({ where: condition, limit, offset }).then((result) => {
        const response = getPagingData(result, page, limit);
        return res.status(200).send(response);
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menampilkan list wallet',
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