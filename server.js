require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyparse =require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

//MiddleWare
app.use(cors());
app.use(bodyparse.json());

//MySQL

// const db=mysql.createConnection({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "root",
//     database: process.env.DB_NAME || "baladatabase",
//     port: process.env.DB_PORT || 3306
// });

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err)=>{
    if(err) {
        console.error('DB Not Connect',err.message)
    }
    else {
        console.log('DB Connect');
        // connection.release();
    }
})

//APIs

// Create Table
app.get("/createtable",(req,res)=>{
    let sql ='create table posts(id int auto_increment,title varchar(100),body text,primary key(id))';
    db.query(sql,(err,result)=>{
        if(!err)
            console.log('Table Created')
        res.send('Table Created')
    })
})

// Insert Data
app.post("/addpost",(req,res)=>{
    let post = {title:req.body.title,body:req.body.body};
    let sql = 'insert into posts SET ?';
    db.query(sql,post,(err,result)=>{
        if(!err)
           { console.log('Post Added') }
        res.send('Post Added')
    })
})

//get Data
app.get("/getposts",(req,res)=>{
    let sql = 'select * from posts';
    db.query(sql,(err,result)=>{
        if(!err)
            console.log('Posts Fetched...')
        res.json(result)
    })
})

//get Post by Id 
app.get("/getpost/:id",(req,res)=> {
    let sql = `select * from posts where id=${req.params.id}`;
    db.query(sql,(err,result)=>{
        if(!err)
            console.log('Post Fetched')
        res.json(result)
    })
});

//update Posts
app.put('/updatepost/:id',(req,res)=>{
    const {id} = req.params;
    const {title,body} = req.body;
    let sql=`update posts set title=?,body=? where id=?`;
    db.query(sql,[title,body,id],(err,result)=>{
        if(!err)
            console.log('updated')
        res.send(result)
    })
})

//delete posts
app.delete('/deleteposts/:id',(req,res)=>{
    const {id} = req.params;
    const sql = `delete from posts where id=?`;
    db.query(sql,[id],(err,result)=>{
        if (err) throw err;
        res.send(result)
    })
});

app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})