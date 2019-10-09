'use strict';

const Database = require ('./database.js');
const fatalError = err => new Error (`Sorry! ${err.message}`);
const getAllProducts = 'select productId, name, model, price, type from product';
const getProduct = 'select productId, name, model, price, type from product ' + 'where productId = ?';
const insertProduct=
    'INSERT INTO product (productId, name, model, price, type) ' +
    'values(?,?,?,?,?)';

const updateProduct=
    'UPDATE product SET name=?, model=?, price=?, type=?  WHERE  productId=? ';

const deleteProduct=
    'DELETE FROM product WHERE productId=?';

const productValues = product => [
    +product.productId,product.name,product.model,
    product.price,product.type
];

const productValuesForUpdate = product => [
    product.name,product.model,
    product.price,product.type, +product.productId
];

module.exports = class ProductDataStorage {
    constructor () {
        this.productDb = new Database ({
            'host': 'localhost',
            'port': 3300,
            'user': 'daniel',
            'password': 'MJRIBk9j',
            'database': 'productdb'
        })
    }

    getAll(){
        return new Promise(async (resolve, reject) =>{
            try {
                const result = await this.productDb.doQuery(getAllProducts);
                resolve(result.queryResult);
            }
            catch(err){
                reject(fatalError(err));
            }
        })
    }
    get(productId){
        return new Promise(async (resolve, reject) => {
            try {
                const result=await this.productDb.doQuery(getProduct, [+productId]);
                if (result.queryResult.length===0){
                    reject(new Error('product unknown'));
                } else {
                    resolve(result.queryResult[0]);
                }
            }
        catch(err){
            reject(new Error(`Sorry! Error. ${err.message}`))
        }
        });
    }

    insert(product){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.productDb.doQuery(insertProduct, productValues(product));
                if (result.queryResult.rowsAffected===0){
                    reject (new Error ('No product was added'));
                }else{
                    resolve (`product with id ${product.productId} was added`);
                }
             }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }
    update (product){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.productDb.doQuery(updateProduct, productValuesForUpdate(product));
                if (result.queryResult.rowsAffected===0){
                    resolve('No data was updated');
             }
                else{
                    resolve (`Data of product with id ${product.productId} was updated`)
                }
            }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }

    delete (productId){
        return new Promise(async (resolve,reject) => {
            try{
                const result = await this.productDb.doQuery(deleteProduct,[+productId]);
                if (result.queryResult.rowsAffected===0){
                    resolve('No data was deleted');
            }
                else{
                    resolve (`product with id ${productId} was deleted`);
                }
            }
            catch(err){
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }
 };