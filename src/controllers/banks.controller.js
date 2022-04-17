const db =require('../models')
const Bank = db.banks;
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: banks } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, banks, totalPages, currentPage };
  };

exports.create_bank = (req, res)=>{
    const {
        nama_akun,
        nomor_rekening,
        kode_bank,
        nama_bank,
    } = req.body;

    Bank.create({
        nama_akun,
        nomor_rekening,
        kode_bank,
        nama_bank,
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Bank'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Bank'
        })
    });
}

exports.update_bank = (req, res)=>{
    const {id} = req.params;
    const {
        nama_akun,
        nomor_rekening,
        kode_bank,
        nama_bank,
    } = req.body;

    Bank.update({
        nama_akun,
        nomor_rekening,
        kode_bank,
        nama_bank,
    },{
        returning: true, 
        where: {id:id}
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Bank'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Tambah Bank'
        })
    });
}

exports.list_bank = (req, res)=>{
    const { page=0, size=15, nama_akun } = req.query;
    var condition = nama_akun ? { nama_akun: { [Op.like]: `%${nama_akun}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Bank.findAndCountAll({ where: condition, limit, offset }).then((result) => {
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

exports.delete_bank = (req, res)=>{
    const {id} = req.params
    Bank.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menghapus Bank'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal menghapus Bank',
            data: null
        });
    });
}

exports.detail_bank = (req, res)=>{
    const {id} = req.params
    Bank.findByPk(id).then((result) => {
        return res.status(200).send({
            message: 'Berhasil menampilkan Bank',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal menampilkan Bank',
            data: null
        });
    });
}