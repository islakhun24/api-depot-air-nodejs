const { months } = require('moment');
const { Sequelize } = require('../models');
const db =require('../models')
const Op = db.op
const Pengeluaran = db.pengeluaran;
const Transaksi = db.transaksi
exports.total_penghasilan = (req, res) =>{

}

exports.total_transaksi = (req, res) =>{
    Transaksi.findAll({
        where: {
            status: 'lunas'
        }
    }).then( async result=>{
        return res.status(200).send({
            data: result.length
        })
    })
}

exports.total_pemasukan = (req, res) =>{
    Transaksi.findAll({
        where: {
            status: 'lunas'
        }
    }).then( async result=>{
        let sum = 0;
        if(result){
            result.forEach(element => {
                sum += parseInt(element.total_biaya)
            });
            return res.status(200).send({
                data: sum
            })
        }

        return res.status(200).send({
            data: sum
        })
    })
}

exports.total_pengeluaran = (req, res) =>{
    Pengeluaran.findAll().then( async result=>{

        let sum = 0;
        if(result){
            result.forEach(element => {
                sum += parseInt(element.harga)
            });
            return res.status(200).send({
                data: sum
            })
        }

        return res.status(200).send({
            data: sum
        })
    })
}

exports.chart_transaksi = async (req, res) =>{
    const pemsaukan = [null,null,null,null,null,null,null,null,null,null,null,null]
    const pengeluaran = [null,null,null,null,null,null,null,null,null,null,null,null]
    Transaksi.findAll({
        attributes: [
            [
                Sequelize.fn('MONTH', Sequelize.col('date')), 'date'
            ],
            [
                Sequelize.fn('SUM', Sequelize.col('total_biaya')), 'amount'
            ]
        ],
        group: [Sequelize.fn('MONTH', Sequelize.col('date'))]
    }).then(async resp=>{
       
        const dataArr = await resp.map((val,i)=>{
            const {dataValues} = val
            pemsaukan[parseInt(dataValues.date)-1] = dataValues.amount
           let data = {
            date : dateFormat(dataValues.date),
            data: dataValues.data,
            amount:dataValues.amount

           }
            return data;
        })
        await Promise.all(dataArr)

        await Pengeluaran.findAll({
            attributes: [
                [
                    Sequelize.fn('MONTH', Sequelize.col('date')), 'tanggal'
                ],
                [
                    Sequelize.fn('SUM', Sequelize.col('harga')), 'harga'
                ]
            ],
            group: [Sequelize.fn('MONTH', Sequelize.col('date'))]
        }).then(async outcome =>{
            const dataArrPem = await outcome.map((value,i)=>{
                const val = value.dataValues
                pengeluaran[parseInt(val.tanggal)-1] = val.harga
               let data = {
                date : dateFormat(val.tanggal),
                amount:val.harga
    
               }
                return data;
            })
            await Promise.all(dataArrPem)
            return res.status(200).send({
                pemasukan: pemsaukan,
                pengeluaran: pengeluaran
            })
        })
    }).catch(err=>{
        console.log(err);
    })
}

function dateFormat(num){
    if(num===1){
        return 'Jan'
    }else if(num===2){
        return 'Feb'
    }else if(num===3){
        return 'Mar'
    }else if(num===4){
        return 'Apr'
    }else if(num===5){
        return 'Mei'
    }else if(num===6){
        return 'Jun'
    }else if(num===7){
        return 'Jul'
    }else if(num===8){
        return 'Ags'
    }else if(num===9){
        return 'Sep'
    }else if(num===10){
        return 'Okt'
    }else if(num===11){
        return 'Nov'
    }else if(num===12){
        return 'Des'
    }else{
        return 'Tidak ada'
    }
}