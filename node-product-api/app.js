// Bibliotecas e constantes

const fs = require('fs');
var https = require('https');
var cookieParser = require('cookie-parser');
var RateLimit = require('express-rate-limit');
//var expressJwt = require('express-jwt');
//var SECRET = 'FZWJIVNzVjEqdnnqjRXmJmV8DYeTgLaTKXgKueu7onJfkiHfAUQDV0XtNboBkAoV';

const bodyParser = require('body-parser');
const express = require('express');
const db = require("./db");
const app = express();
const port = 3001;

var privateKey  = fs.readFileSync('sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const checkScopes = requiredScopes('openid');


const checkJwt = auth({
    audience: 'http://localhost:4200',
    issuerBaseURL: `https://dev-rg7q8np0.us.auth0.com`
});

// Autenticacao e Autorizacao

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());


var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: 50,
    //standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	//legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    //delayMs: 300,
    message: "Too many accounts created from this IP, please try again after an hour"
});

app.use(limiter);

// Rotas da API

app.get('/products', checkJwt, checkScopes, async (req, res, next) => {
    var resp = await db.getAllProducts();
    res.status(200).json(resp);
});

//checkJwt, checkScopes,
app.post('/products', checkJwt, checkScopes, async (req, res, next) => { 
    try{
        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        await db.insertProduct(name, description, value);
        return res.status(200).json({message: 'Produto cadastrado com sucesso!'});

    }catch(err){
        return res.status(err.code).json(err);
    }
});


//checkJwt, checkScopes, 
app.get('/products/:id', checkJwt, checkScopes, async (req, res, next) => { 

    try{
        var id = req.params.id;
        const [rows] = await db.getProductById(id);
        if(rows){
            return res.status(200).send(rows);
        }
        return res.status(404).send(`Produto ${id} não encontrado!`);
    }catch(err){
        return res.status(err.code).json(err);
    }
});

//checkJwt, checkScopes, 
app.put('/products/:id', checkJwt, checkScopes, async (req, res, next) => { 

    try{
        var id = req.params.id;

        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        const rows = await db.updateProductById(id, name, description, value);
        if(rows){
            return res.status(200).send({message: "Produto atualizado com sucesso!"});
        }
        return res.status(404).send(`Produto ${id} atualizado com sucesso!`);
    }catch(err){
        return res.status(err.code).json(err);
    }
});

//checkJwt, checkScopes, 
app.delete('/products/:id', checkJwt, checkScopes, async (req, res, next) => {

    try{
        var id = req.params.id;
        await db.deleteProductById(id);
        return res.status(200).send({message: `Produto ${id} deletado com sucesso!`}); 

    }catch(err){
        return res.status(err.code).json(err);
    }
});

httpsServer.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`)
})