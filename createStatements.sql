-- first clear old version if there is one

drop database if exists productdb;

-- create database
create database productdb;

-- connect to that db. Now further commands modifies productdb
use productdb;

-- create table(s)
create table product (
    productId integer not null primary key, -- unique value, compulsory column
    name varchar(15) not null, -- required
    model integer not null, -- required
    price integer not null, 
    type varchar(20) not null
);

insert into product (productId, name, model, price, type)
values (1,'smasung', '588', '558', 'old');

insert into product values (2,'Apple','659', '8552', 'New');


CREATE USER IF NOT EXISTS 'daniel'@'localhost' identified by 'MJRIBk9j';

-- we give access to the user to out database
grant all privileges on productdb.* to 'daniel'@'localhost';