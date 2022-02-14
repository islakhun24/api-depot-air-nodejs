
const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller");
const bank = require("../controllers/banks.controller");
const barang = require("../controllers/barang.controller");
const customer = require("../controllers/customer.controller");
const ewallet = require("../controllers/ewallet.controller");
const pengeluaran = require("../controllers/pengeluaran.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    //Ganti Password
    app.post("/api/user/change-password",[authJwt.verifyToken],user.change_password
    );

    //Ganti Username dan Password
    app.post("/api/user/change-username-and-password",[authJwt.verifyToken],user.change_username_and_password
    );

    //Edit Profil
    app.post("/api/user/update-profile",[authJwt.verifyToken],user.update_profile
    );

    //Lihat Profil
    app.get("/api/user/profile",[authJwt.verifyToken],user.profile
    );
    
    //BANk
    app.post("/api/bank", [authJwt.verifyToken], bank.create_bank);
    app.put("/api/bank/:id", [authJwt.verifyToken], bank.update_bank);
    app.get("/api/bank", [authJwt.verifyToken], bank.list_bank);
    app.get("/api/bank/:id", [authJwt.verifyToken], bank.detail_bank);
    app.delete("/api/bank/:id", [authJwt.verifyToken], bank.delete_bank);

    //BARANG
    app.post("/api/barang", [authJwt.verifyToken], barang.create_barang);
    app.put("/api/barang/:id", [authJwt.verifyToken], barang.update_barang);
    app.get("/api/barang", [authJwt.verifyToken], barang.list_barang);
    app.get("/api/barang/:id", [authJwt.verifyToken], barang.detail_barang);
    app.delete("/api/barang/:id", [authJwt.verifyToken], barang.delete_barang);

    //EWALLET
    app.post("/api/ewallet", [authJwt.verifyToken], ewallet.create_ewallet);
    app.put("/api/ewallet/:id", [authJwt.verifyToken], ewallet.update_ewallet);
    app.get("/api/ewallet", [authJwt.verifyToken], ewallet.list_ewallet);
    app.get("/api/ewallet/:id", [authJwt.verifyToken], ewallet.detail_ewallet);
    app.delete("/api/ewallet/:id", [authJwt.verifyToken], ewallet.delete_ewallet);

    //CUSTOMER
    app.post("/api/customer", [authJwt.verifyToken], customer.create_customer);
    app.put("/api/customer/:id", [authJwt.verifyToken], customer.update_customer);
    app.get("/api/customer", [authJwt.verifyToken], customer.list_customer);
    app.get("/api/customer/:id", [authJwt.verifyToken], customer.detail_customer);
    app.delete("/api/customer/:id", [authJwt.verifyToken], customer.delete_customer);


    //PENGELUARAN
    app.post("/api/pengeluaran", [authJwt.verifyToken], pengeluaran.create_pengeluaran);
    app.put("/api/pengeluaran/:id", [authJwt.verifyToken], pengeluaran.update_pengeluaran);
    app.get("/api/pengeluaran", [authJwt.verifyToken], pengeluaran.list_pengeluaran);
    app.get("/api/pengeluaran/:id", [authJwt.verifyToken], pengeluaran.detail_pengeluaran);
    app.delete("/api/pengeluaran/:id", [authJwt.verifyToken], pengeluaran.delete_pengeluaran);


    //CRUD Barang -> Barang TERJUAL
    //CRUD CUSTOMER -> JUMLAH CUSTOMER MEMBELI
    //TAMBAH TRANSAKSI
    //PELAPORAN TRANSAKSI -> PENGHASILAN PERBULAN, PERMINGGU, HARI INI, TAHUN, RANGE TANGGAL
    //PENGELUARAN BULANAN -> LISTRIK
    //KEUNTUNGAN
  };