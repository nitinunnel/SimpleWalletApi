//const { main } = require('../run/main');

var express = require('express')
var mysql = require('mysql')

var app = express()
var str;

const DB = exports.DB = class DB {
    db(name, balance) {
        var con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "14011997",
            database: "chomchob"
        })

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            // var sql = "INSERT INTO payment (ID, money) VALUES ('" + name + "','" + balance + "')";
            // con.query(sql, function (err, result) {
            //     if (err) throw err;
            //     //console.log("1 record inserted");
            // });

            con.query("SELECT ID, money FROM payment", function (err, result, fields) {
                if (err) throw err;
                con.query("UPDATE payment SET money = '" + balance + "' WHERE ID = '" + name + "'", function (err, result) {
                    if (err) throw err;
                });
            });

        });
    }
}