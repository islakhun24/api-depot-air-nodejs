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
      let worksheet = workbook.addWorksheet("Depot Air Minum Mekarsari");
      worksheet.getCell(`A1`).value = "Pengeluaran Depot Air Minum Mekarsari";
      worksheet.getCell(`A1`).alignment = {} // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
            worksheet.mergeCells('A1:F1'); // Extend cell over all column headers
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'left' }     
     worksheet.getCell('A1').font = { bold: true, size: 18 }; 
      worksheet.getCell('A3').font = { bold: true };
      worksheet.getCell('B3').font = { bold: true };
      worksheet.getCell('C3').font = { bold: true };
      worksheet.getCell('D3').font = { bold: true };
      worksheet.getCell('E3').font = { bold: true };
      worksheet.getCell('F3').font = { bold: true };
      worksheet.getCell('E3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        };
        worksheet.getCell('F3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        };
        worksheet.getCell('D3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        };
        worksheet.getCell('C3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        };
        worksheet.getCell('B3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        }; 
        worksheet.getCell('A3').fill = { 
            type: 'pattern',
            pattern:'solid',
			fgColor:{ argb:'cccccc' }
        };
        worksheet.getRow(1).height = 20;
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'left' };
        worksheet.getColumn('E').numFmt = '#,##0';
        worksheet.getCell('A3').value = "Tanggal";
        worksheet.getCell('B3').value = "Nama Pengeluaran";
        worksheet.getCell('C3').value = "Satuan";
        worksheet.getCell('D3').value = "Jumlah";
        worksheet.getCell('E3').value = "Harga";
        worksheet.getCell('F3').value = "Keterangan";
      worksheet.columns = [
        {  key: "date", width: 20 },
        { key: "nama_pengeluaran", width: 50 },
        {  key: "satuan", width: 10 },
        {  key: "jumlah", width: 10 },
        {  key: "harga", width: 20 },
        {  key: "keterangan", width: 100 },
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