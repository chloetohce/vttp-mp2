drop database if exists mp2;
create database mp2;
use mp2;

-- TODO: Double check password length.
create table users (
    uid int not null auto_increment,
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,

    constraint pk_uid primary key(uid)
);

grant all privileges on mp2.* to 'chloe'@'%';
flush privileges;