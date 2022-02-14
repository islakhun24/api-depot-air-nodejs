const db = require('../models');
const User = db.user;
const md5 = require('md5');

exports.change_password = (req, res)=>{
    const userId = req.userId;
    const {
        password1,
        password2
    } = req.body;

    if(password1!==password2){
        return res.status(500).send({
            message: 'Password tidak sama'
        })
    }

    User.update(
        {
            password: md5(password1)
        }, 
        {
            returning: true,
            where: {
                id: userId
            }
        }
    ).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Ganti Password'
        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal Ganti Password'
        });
    });

}
exports.change_username_and_password = (req, res)=>{
    const userId = req.userId;
    const {
        username,
        password1,
        password2
    } = req.body;

    if(password1!==password2){
        return res.status(500).send({
            message: 'Password tidak sama'
        })
    }

    User.update(
        {
            username: username,
            password: md5(password1)
        }, 
        {
            returning: true,
            where: {
                id: userId
            }
        }
    ).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Ganti Username & Password'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Ganti Username & Password'
        });
    });

}

exports.update_profile = (req, res)=>{
    const userId = req.userId;
    const {
        nama_perusahaan,
        alamat_perusahaan,
        nohp_perusahaan,
        logo_perusahaan
    } = req.body;

    User.update(
        {
            nama_perusahaan: nama_perusahaan,
            alamat_perusahaan: alamat_perusahaan,
            nohp_perusahaan: nohp_perusahaan,
            logo_perusahaan: logo_perusahaan
        }, 
        {
            returning: true,
            where: {
                id: userId
            }
        }
    ).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Ganti Profile'
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Ganti Profile'
        });
    });

}

exports.profile = (req, res)=>{
    const userId = req.userId;
    User.findByPk(userId).then((result) => {
        return res.status(200).send({
            message: 'Berhasil Menampilkan data profil',
            data: result
        });
    }).catch((err) => {
        return res.status(500).send({
            message: 'Gagal Menampilkan data profil',
            data: null
        });
    });

}
