'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const config = require('./lib/config.js');

mongoose.Promise = Promise;
mongoose.connect(config.db.url);

const Products = require('./models/Products');
const Cart = require('./lib/Cart');
const Security = require('./lib/Security');

const store = new MongoDBStore({
    uri: config.db.url,
    collection: config.db.sessions
});

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('env', 'development');

app.locals.paypal = config.paypal;
app.locals.locale = config.locale;

app.use(favicon(path.join(__dirname, 'favicon.png')));
app.use('/public', express.static(path.join(__dirname, '/public'), {
  maxAge: 0,
  dotfiles: 'ignore',
  etag: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: 'destroy',
    name: config.name
}));

app.get('/', (req, res) => {
  Products.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
      let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
      products.forEach( (product) => {
         product.formattedPrice = format.format(product.price);
      });
      res.render('index', {
          pageTitle: 'Node.js Shopping Cart',
          products: products,
          nonce: Security.md5(req.sessionID + req.headers['user-agent'])
      });

  }).catch(err => {
      res.status(400).send('Bad request');
  });

});

app.get('/supp1', (req, res) => {
  Products.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
      let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
      products.forEach( (product) => {
         product.formattedPrice = format.format(product.price);
      });
      res.render('index', {
          pageTitle: 'Node.js Shopping Cart',
          products: products,
          nonce: Security.md5(req.sessionID + req.headers['user-agent'])
      });

  }).catch(err => {
      res.status(400).send('Bad request');
  });

});


app.get('/cart', (req, res) => {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('cart', {
        pageTitle: 'Cart',
        cart: cart,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });
});

app.get('/cart/remove/:id/:nonce', (req, res) => {
   let id = req.params.id;
   if(/^\d+$/.test(id) && Security.isValidNonce(req.params.nonce, req)) {
       Cart.removeFromCart(parseInt(id, 10));
       Cart.saveCart(req);
       res.redirect('/cart');
   } else {
       res.redirect('/');
   }
});

app.get('/cart/empty/:nonce', (req, res) => {
    if(Security.isValidNonce(req.params.nonce, req)) {
        Cart.emptyCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
});

app.post('/cart', (req, res) => {
    let qty = parseInt(req.body.qty, 10);
    let product = parseInt(req.body.product_id, 10);
    if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
        Products.findOne({product_id: product}).then(prod => {
            Cart.addToCart(prod, qty);
            Cart.saveCart(req);
           // do your thang
            res.redirect('back');
            // res.redirect('/cart');
        }).catch(err => {
           res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

app.post('/cart/update', (req, res) => {
    let ids = req.body["product_id[]"];
    let qtys = req.body["qty[]"];
    if(Security.isValidNonce(req.body.nonce, req)) {
        Cart.updateCart(ids, qtys);
        Cart.saveCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
});

app.get('/checkout', (req, res) => {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('checkout', {
        pageTitle: 'Checkout',
        cart: cart,
        checkoutDone: false,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });
});

app.post('/checkout', (req, res) => {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    if(Security.isValidNonce(req.body.nonce, req)) {
        res.render('checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: true
        });
    } else {
        res.redirect('/');
    }
});


app.get('/add_product', (req, res) => {

        res.render('add_prod', {
            pageTitle: 'Add Product'
          })
    

});

app.post('/add_product', (req, res) => {
  // console.log(req.body);
  var newProd = new Products(req.body);
  console.log(newProd)
  Products.create(newProd, function(err, newprod){
    if(err){
      console.log(err)
    }else{
      console.log(newprod);
      res.redirect("/add_product")
    }
  })

});


if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
});

app.listen(port);