const db =require('../models')
const Barang = db.barang;
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};
  
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: barangs } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, barangs, totalPages, currentPage };
};

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
    const { page=0, size=15, nama_barang } = req.query;
    var condition = nama_barang ? { nama_barang: { [Op.like]: `%${nama_barang}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Barang.findAndCountAll({ where: condition, limit, offset }).then((result) => {
        console.log('result', result);
        const response = getPagingData(result, page, limit);
        return res.status(200).send(response);
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