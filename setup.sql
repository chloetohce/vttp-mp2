drop database if exists mp2;
create database mp2;
use mp2;

-- TODO: Double check password length.
create table users (
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    refreshToken char(36),

    constraint pk_username primary key(username)
);

grant all privileges on mp2.* to 'chloe'@'%';
flush privileges;