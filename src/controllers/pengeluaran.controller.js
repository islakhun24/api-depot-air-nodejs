const db =require('../models')
const Pengeluaran = db.pengeluaran;
var moment = require('moment');

const excel = require("exceljs");
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
    
    const { page=0, size=15, nama_pengeluaran, toDate, fromDate } = req.body;
    var condition = nama_pengeluaran ? { nama_pengeluaran: { [Op.like]: `%${nama_pengeluaran}%` } } : null;

    var conditionDate = fromDate && toDate ? {date : {
        [Op.between]: [fromDate, toDate]
    }}:null

    const { limit, offset } = getPagination(page, size);
    Pengeluaran.findAndCountAll({ where: {
        [Op.and]:[condition, conditionDate]
    }, limit, offset }).then((result) => {
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

exports.download = (req, res) => {
    const { toDate, fromDate } = req.body;
    var conditionDate = fromDate && toDate ? {date : {
        [Op.between]: [fromDate, toDate]
    }}:null
    Pengeluaran.findAll({
        where: conditionDate
    }).then((objs) => {
      let pengeluaran = [];
      objs.forEach((obj) => {
        pengeluaran.push({
            date: obj.date,
            nama_pengeluaran: obj.nama_pengeluaran,
            satuan: obj.satuan,
            jumlah: obj.jumlah,
            harga: parseInt(obj.harga),
            keterangan: obj.keterangan
        });
      });
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Pengeluaran");
      worksheet.getCell('A1').font = { bold: true };
      worksheet.getCell('B1').font = { bold: true };
      worksheet.getCell('C1').font = { bold: true };
      worksheet.getCell('D1').font = { bold: true };
      worksheet.getCell('E1').font = { bold: true };
      worksheet.getCell('F1').font = { bold: true };
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
        worksheet.getRow(1).height = 20;
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getColumn('E').numFmt = '#,##0';
      worksheet.columns = [
        { header: "Tanggal", key: "date", width: 20 },
        { header: "Nama Pengeluaran", key: "nama_pengeluaran", width: 50 },
        { header: "Satuan", key: "satuan", width: 10 },
        { header: "Jumlah", key: "jumlah", width: 10 },
        { header: "Harga", key: "harga", width: 20 },
        { header: "Keterangan", key: "keterangan", width: 100 },
      ];
      // Add Array Rows
      worksheet.addRows(pengeluaran);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "pengeluaran.xlsx"
      );
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    });
  };