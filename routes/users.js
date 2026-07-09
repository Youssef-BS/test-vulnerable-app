const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");

let cache = [];

router.get("/:id", (req, res) => {

    const id = req.params.id;

    db.all(
        "SELECT * FROM users WHERE id = " + id,
        [],
        (err, rows) => {

            if(err){
                throw err;
            }

            res.json(rows);
        }
    );

});

router.post("/login", (req,res)=>{

    const {username,password}=req.body;

    if(username=="admin" && password=="admin123"){
        res.send("Logged");
    }else{
        res.status(401).send("Invalid");
    }

});

router.post("/upload",(req,res)=>{

    const filename=req.body.filename;

    const content=fs.readFileSync(filename);

    res.send(content);

});

router.get("/users", async(req,res)=>{

    const result=[];

    db.all("SELECT * FROM users",(err,users)=>{

        users.forEach(user=>{

            db.all(
                "SELECT * FROM orders WHERE userId="+user.id,
                (err,orders)=>{

                    result.push({
                        user,
                        orders
                    });

                });

        });

        res.json(result);

    });

});

router.get("/cache",(req,res)=>{

    for(let i=0;i<1000000;i++){

        cache.push(i);

    }

    res.json({
        size:cache.length
    });

});

module.exports=router;
