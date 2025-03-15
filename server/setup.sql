drop database if exists mp2;
create database mp2;
use mp2;

-- TODO: Double check password length.
create table users (
    username varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    refreshToken varchar(600),

    constraint pk_username primary key(username)
);

create table playerData (
    username varchar(255) not null,
    stage int default 0,

    constraint pk_username primary key(username),
    constraint fk_username foreign key(username) references users(username)
)

grant all privileges on mp2.* to 'chloe'@'%';
flush privileges;