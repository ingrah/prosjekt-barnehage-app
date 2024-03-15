import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import DBManager from "./modules/dbManager/storageManager.mjs"; 


import SuperLogger from './modules/SuperLogger.mjs';
// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);


// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

server.use(express.json()); 
// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

server.post("/login",async (req, res, next) =>{

const credential = req.headers.authorization.split(" ")[1];


const [username,password]= Buffer.from(credential, "base64").toString("utf8").split(":");
const user= await DBManager.getUser(username);
if (user[0].password===password){
    
    
   let role=user[0].role ? user[0].role : "ingen";
    
    let token=user[0].id+"."+Date.now()+"."+role;
    res.status(200).json({token}).end();
}
else 
{
    
    res.status(401).end();
}
});

server.delete("/deleteMessage/:id",async(req,res)=>{
    
    let id=req.params.id;
    let respons=await DBManager.deletemessage(id);
    if(respons){
        res.status(200).end();
    }
    else{
        res.status(500).end();
    }
})
server.put("/updateMessage",async(req,res)=>{
const {msg,id}=req.body;
let respons=await DBManager.updatemessage(id,msg);
if (respons){
    res.status(200).end();
}
else{
    res.status(500).end();  
}
})

server.get("/getansattmeldinger", async(req, res, next) => {
    let messages = await DBManager.getansattmessages();
    
    if (messages) {
        res.status(200).json(messages).end();
    }
    else {
        res.status(500).end();
    }
});

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port')); 
});



