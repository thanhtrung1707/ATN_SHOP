var express = require('express');
var router = express.Router();
var pg_conn = require('../models/pg_config');

/* GET users page . */
router.get('/', function(req, res, next) {
  res.render('users', {title: "User page", message: "Authorized users"});
});

/* GET EDIT page */
router.get('/edit/:name', function(req, res) {
  var prod_name = req.params.name;
  const edit_query = {
    text: `SELECT * FROM product WHERE produc_name=$1`,
    values: [prod_name]
  };
  pg_conn.query(edit_query, function(err, data){
    if (err) throw err;
    res.render('edit_form', {title: "Edit page", edit_data: data.rows[0]});
  });
});
/* POST from the edit_form submision */
router.post('/edit/:name', function(req, res){
  var prod_name = req.params.name;
  const update_query = {
    text: "UPDATE product SET id=$1, shop_name=$2, produc_name=$3, price=$4, amount=$5 WHERE produc_name=$6",
    values: [req.body.id, req.body.shop_name, req.body.produc_name, req.body.price, req.body.amount, prod_name]
  };
  pg_conn.query(update_query, function(err, data){
    if (err) {
      throw err;
      res.render('error', {message: "Update got an error", error: err});
    
    } else {
      var product_query = 'SELECT * FROM product';
      pg_conn.query(product_query, function(err, data){
        //console.log(data);
        res.render('users_fe', {title: "Userpage",
                                h1_title: "Welcome to ATN shop page",
                                h2_title: "Updated database sucessfully",
                                userData: data});
      });
      
      
    };
  });
});
module.exports = router;
