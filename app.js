const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('public'));

app.engine('hbs', expressHbs.engine({ extname: "hbs", defaultLayout: null }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(bodyParser.json())

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.json())

const uri = 'mongodb+srv://MinhKuann:OUlaAza7DqSTq43v@cluster0.mdgs9of.mongodb.net/Assignment?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserModal = require('./Model/UserModal')
const SanPhamModal = require('./Model/SanPhamModal');
const { request } = require('http');
const { title } = require('process');


//-------------------------------------------


//-------------------------------------------


app.get('/', function (req, res) {
  res.render('trangchu.hbs')
})

app.get('/trangchu', function (req, res) {
  SanPhamModal.find({}).then(sanphams => {
    res.render('trangchu.hbs', {
      sanphams: sanphams.map(sanpham => sanpham.toJSON())
    })
  })
})

app.get('/dangnhap', function (req, res) {
  res.render('dangnhap');
})

app.post('/dangnhap', async function (req, res) {
  let user = await UserModal.findOne({ ten: req.body.ten })
  console.log(req.body);

  if (!user) {
    return res.render("dangnhap")
  } else {
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (isMatch && !err) {
        res.render('trangchu');
      } else {
        return res.render("trangchu")
      }
    })
  }
})

app.get('/dangkitaikhoan', function (req, res) {
  res.render('dangki');
})
app.post('/dangki', function (req, res) {
  const user = new UserModal({
    ten: req.body.ten,
    email: req.body.email,
    sdt: req.body.sdt,
    password: req.body.password
  });

  user.save().then(result => {
    console.log('Thêm thành công');
    console.log(user);
    UserModal.find({}).then(users => {
      res.render('dangnhap.hbs', {
        users: users.map(user => user.toJSON())
      })
    })
  })
    .catch(err => {
      console.error('Lỗi', err);
    })
})

app.get('/user', function (req, res) {
  // await mongoose.connect(uri);
  console.log('Kết nối thành công');
  UserModal.find({}).then(users => {
    res.render('user.hbs', {
      users: users.map(user => user.toJSON())
    })
  })
})

app.get('/adduser', function (req, res) {
  res.render('adduser');
})

app.post('/themuser', async (req, res) => {
  const user = new UserModal({
    ten: req.body.ten,
    email: req.body.email,
    sdt: req.body.sdt,
    password: req.body.password
  });

  user.save().then(result => {
    console.log('Thêm thành công');
    console.log(user);
    UserModal.find({}).then(users => {
      res.render('user.hbs', {
        users: users.map(user => user.toJSON())
      })
    })
  })
    .catch(err => {
      console.error('Lỗi', err);
    })

});

app.get('/updateuser/:id', async (req, res) => {
  let user = await UserModal.findOne({ _id: req.params.id })

  res.render('updateuser.hbs', {
    id: req.params.id,
    ten: user.ten,
    email: user.email,
    sdt: user.sdt
  })

  // res.render('updatesp.hbs')

})

app.post('/updateuser', async (req, res) => {
  var id = req.body.id;
  var ten = req.body.ten;
  var email = req.body.email;
  var sdt = req.body.sdt;

  try {
    await UserModal.findOneAndUpdate({ _id: id }, {
      ten: ten,
      email: email,
      sdt: sdt
    });

    res.redirect('/user')
  } catch (error) {
    res.send('Error')
  }

  res.render('updateuser.hbs')
})


app.get('/delete/:id', async function (req, res) {
  let sp = await UserModal.findByIdAndDelete(req.params.id);

  res.redirect('/user')

});

//-------------------------------------------------------------

app.get('/sanpham', function (req, res) {
  // await mongoose.connect(uri);
  console.log('Kết nối thành công');
  SanPhamModal.find({}).then(sanphams => {
    res.render('sanpham.hbs', {
      sanphams: sanphams.map(sanpham => sanpham.toJSON())
    })
  })
})

app.get('/addsanpham', function (req, res) {
  res.render('addsanpham')
})

app.post('/addsanpham', async (req, res) => {
  const sanpham = new SanPhamModal({
    tensanpham: req.body.tensanpham,
    soluong: req.body.soluong,
    giatien: req.body.giatien,
    anh: req.body.anh
  });

  sanpham.save().then(result => {
    console.log('Thêm thành công');
    console.log(sanpham);
    SanPhamModal.find({}).then(sanphams => {
      res.render('sanpham.hbs', {
        sanphams: sanphams.map(sanpham => sanpham.toJSON())
      })
    })
  })
    .catch(err => {
      console.error('Lỗi', err);
    })

});

app.get('/updatesanpham/:id', async (req, res) => {
  let sanpham = await SanPhamModal.findOne({ _id: req.params.id })

  res.render('updatesanpham.hbs', {
    id: req.params.id,
    tensanpham: sanpham.tensanpham,
    soluong: sanpham.soluong,
    giatien: sanpham.giatien,
    anh: sanpham.anh
  })

  // res.render('updatesp.hbs')

})

app.post('/updatesanpham', async (req, res) => {
  var id = req.body.id;
  var tensanpham = req.body.tensanpham;
  var soluong = req.body.soluong;
  var giatien = req.body.giatien;
  var anh = req.body.anh;

  try {
    await SanPhamModal.findOneAndUpdate({ _id: id }, {
      tensanpham: tensanpham,
      soluong: soluong,
      giatien: giatien,
      anh: anh
    });

    res.redirect('/sanpham')
  } catch (error) {
    res.send('Error')
  }

  res.render('updatesanpham.hbs')
})

app.get('/deletesanpham/:id', async function (req, res) {
  let sanpham = await SanPhamModal.findByIdAndDelete(req.params.id);

  res.redirect('/sanpham')

});

app.get('/searchuser', async function (req, res) {
  let result = await UserModal.find({
    "$or": [
      {
        ten: { $regex: req.query.key }
      },
    ]
  }).then(users => {
    res.render('user.hbs', {
      users: users.map(result => result.toJSON())
    });
  });
})

app.get('/searchsanpham', async function (req, res) {
  let kq = await SanPhamModal.find({
    "$or": [
      {
        tensanpham: { $regex: req.query.key }
      },
    ]
  }).then(sanphams => {
    res.render('sanpham.hbs', {
      sanphams: sanphams.map(kq => kq.toJSON())
    });
  });
})



app.listen('3000');