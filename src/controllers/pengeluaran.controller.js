const db =require('../models')
const Pengeluaran = db.pengeluaran;
var moment = require('moment');
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: pengeluaran } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, pengeluaran, totalPages, currentPage };
  };
exports.create_pengeluaran = (req, res)=>{
    const {
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date,

   } = req.body;
   let dates = new Date(date)
   const tanggal = dates.toISOString().split('T')[0]
   console.log(tanggal);
   Pengeluaran.create({
        nama_pengeluaran, satuan, jumlah, harga, keterangan, date: tanggal,
    }).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Tambah Pengeluaran'
        });
    }).catch((err) => {
        console.log(err)
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
    
    const { page=0, size=15, nama_pengeluaran } = req.query;
    var condition = nama_pengeluaran ? { nama_pengeluaran: { [Op.like]: `%${nama_pengeluaran}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Pengeluaran.findAndCountAll({ where: condition, limit, offset }).then((result) => {
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