const db =require('../models')
const Customer = db.customer;
const Op = db.op;
const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: customer } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, customer, totalPages, currentPage };
  };
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
    const { page=0, size=15, nama_customer } = req.query;
    var condition = nama_customer ? { nama_customer: { [Op.like]: `%${nama_customer}%` } } : null;

    const { limit, offset } = getPagination(page, size);
    Customer.findAndCountAll({ where: condition, limit, offset }).then((result) => {
        const response = getPagingData(result, page, limit);
        return res.status(200).send(response);
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