const db = require('../models');
const User = db.user;
const md5 = require('md5');
const fs = require('fs');
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
    console.log('userId', userId);
    const {
        nama_perusahaan,
        alamat_perusahaan,
        nohp_perusahaan
    } = req.body;

    User.update(
        {
            nama_perusahaan: nama_perusahaan,
            alamat_perusahaan: alamat_perusahaan,
            nohp_perusahaan: nohp_perusahaan
        }, 
        {
            returning: true,
            where: {
                id: userId
            }
        }
    ).then((result) => {
        console.log('userId', result);
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
    console.log('userId', userId);
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

exports.change_photo = async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const {userId} = req
    if (!req.file) {
        return res.send("No file upload");
    } else {
        User.update(
            {
                logo_perusahaan: url + '/public/' + req.file.filename
            }, 
            {
                returning: true,
                where: {
                    id: userId
                }
            }
        ).then((result) => {
            console.log('userId', result);
            return res.status(200).send({
                message: 'Berhasil Ganti Profile'
            });
        }).catch((err) => {
            return res.status(500).send({
                message: 'Gagal Ganti Profile'
            });
        });
    }
  };

  exports.get_photo = async (req, res) => {
    const {id} = req.params
    
    User.findByPk(id).then((result) => {
        console.log(result);
        fs.readFile(result.logo_perusahaan, function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            else {
              res.writeHead(200, {'Content-Type': 'image/jpeg'});
              res.end(data); // Send the file data to the browser.
            }
          });
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({
            message: 'Gagal Menampilkan data profil',
            data: null
        });
    });
  }
