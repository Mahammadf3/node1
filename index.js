const express=require("express");
const app=express();
app.use(express.json());
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const database=path.join(__dirname,"sql.db");
let db=null;
const book= async()=>{
        try{
            db=await open({
                filename:database,
                driver:sqlite3.Database
            })
            app.listen(3004,()=>{
                console.log("server is running at port 3004")
            })
        }
        catch(e){
            console.log(`error:${e}`)
        }
}
book()

app.get("/book",async(request,response)=>{
    const r=`
    SELECT * FROM book`
    const a= await db.all(r)
    response.send(a)
})

app.post("/book/",async(request,response)=>{
    const bookData=request.body;
    const {id,name,date,author}=bookData;
    const added=`
    INSERT INTO book(id,name,p_date,author)
    values
    (${id},'${name}','${date}','${author}');
    `;
    const p=await db.run(added);
    const s=p.lastID;
    response.send({hi:s})
})

app.put("/book/:bookId",async(request,response)=>{
    const data=request.body;
    const {bookId}=request.params
    const {id,name,date,author}=data;
    const uptoDate=`
    UPDATE
    book
    SET
    id=${id},
    name='${name}',
    p_date='${date}',
    author='${author}'
    WHERE
    id=${bookId};
    `;
    await db.run(uptoDate);
    response.send("success")
})

app.delete("/book/:bookId/",async(request,response)=>{
    const {bookId}=request.params;
    const del=`
    DELETE
    FROM 
    book
    WHERE
    id=${bookId};
    `;
    await db.run(del);
    response.send("deleted");
})

app.get("/book/",async(request,response)=>{
    const {search_q,limit}=request.query;
    const h=`
    SELECT
    name
    FROM
    book
    where
    name like '${search_q}
    limt='${limit}'
    `;
    const a=await db.get(h);
    response.send(a);
})