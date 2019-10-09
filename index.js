'use strict';

const http = require('http');
const express = require('express');
const path = require('path');

const app=express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const server = http.createServer(app);

const ProductDataStorage=require('./datastorage.js');
const dataStorage = new ProductDataStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, 'public', 'menu.html')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));

app.get('/all', (req,res)=> dataStorage.getAll()
    .then(result => res.render('allProducts', {result}))
    .catch(err => console.log(err.message))
);

app.get('/getproduct', (req, res) =>
res.render('getProduct', {title: 'Get', header: 'Get', action:'/getproduct'})
);

app.post('/getproduct', (req,res)=>{
    if(!req.body) res.sendErrorPage('Not found');
    const productId=req.body.productId;
    dataStorage.get(productId)
    .then(product => res.render('productPage', {result: product}))
    .catch(error=>sendErrorPage(res,error.message));
});

app.get('/inputform', (req, res)=>{
    res.render('form', {
        header:'Add a new Product',
        action:'/insert',
        productId:{value:'', readonly:''},
        name:{value:'', readonly:''},
       model:{value:'', readonly:''},
        price:{value:'', readonly:''},
        type:{value:'', readonly:''}
    });
});

app.post('/insert', (req,res)=>{
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.insert(req.body)
        .then(message => sendStatusPage(res, message))
        .catch(error => sendErrorPage(res,error));
});

app.get('/updateform', (req,res) => {
    res.render('form', {
        header:'Update product',
        action:'/updatedata',
        productId:{value:'', readonly:''},
        name:{value:'', readonly:'readonly'},
       model:{value:'', readonly:'readonly'},
       price:{value:'', readonly:'readonly'},
        type:{value:'', readonly:'readonly'}
    });
})

app.post('/updatedata', async (req,res) => {
    const productId=req.body.productId;
    try {
        const product=await dataStorage.get(productId);
        console.log(product);
        res.render('form', {
            header: 'Update product data',
            action: '/updateproduct',
            productId:{value:product.productId, readonly:'readonly'},
           name:{value:product.name, readonly:''},
            model:{value:product.model, readonly:''},
            price:{value:product.price, readonly:''},
            type:{value:product.type, readonly:''}
        });
    }
    catch(err){
        sendErrorPage(res,err.message);
    }
})

app.post('/updateproduct', (req,res) => {
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.update(req.body)
        .then(message=>sendStatusPage(res,message))
        .catch(error=>sendErrorPage(res,error.message))
});


app.get('/deleteproduct', (req,res) => 
    res.render('getProduct', {title:'Remove', header:'Remove', action:'/deleteproduct'})
);

app.post('/deleteproduct', (req,res) => {
    if(!req.body) sendErrorPage(res, 'Not found');
    dataStorage.delete(req.body.productId)
        .then(message=>sendStatusPage(res, message))
        .catch(error=>sendErrorPage(res, error.message));
});


server.listen(port, host, ()=>
console.log(`Server ${host} is server at port ${port}.`));

function sendErrorPage(res, message){
    res.render('statusPage', {title:'Error', 
                              header:'Error', 
                              message:message});
}

function sendStatusPage(res, message){
    res.render('statusPage', {title:'Status', 
                              header:'Status', 
                              message:message});
}