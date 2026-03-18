const express=require("express");
const cors=require("cors");
const mongoose = require("mongoose");

const Usuario = require("./models/Usuario");

const app=express();
const port=(3600);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://Emma:Emma832005@ac-ouxyigx-shard-00-00.yn0gme8.mongodb.net:27017,ac-ouxyigx-shard-00-01.yn0gme8.mongodb.net:27017,ac-ouxyigx-shard-00-02.yn0gme8.mongodb.net:27017/GrupoStreamingB?ssl=true&replicaSet=atlas-r4kzsp-shard-0&authSource=admin&appName=Cluster0")
.then(
    ()=>console.log("MongoDB database service listo!")
)
.catch(
    err => console.log(err)
);

/*let registros = [
    {
        id:1,
        nombre:"Ana Lopez",
        email:"ana@hotmail.com",
        genero:"Femenino",
        plataformas:["Netflix", "HBO"]
    },
    {
        id:2,
        nombre:"Juan Gonzalez",
        email:"juan@hotmail.com",
        genero:"Masculino",
        plataformas:["HBO"]
    }
];*/

let idActual=3;

app.get("/api/usuarios", async(req, res)=>{
    const usuarios= await Usuario.find();
    res.json(usuarios);
});

app.post("/api/usuarios", async(req, res)=>{
    const nuevo = new Usuario(
        {
            nombre:req.body.nombre,
            email:req.body.email,
            genero:req.body.genero,
            plataformas:req.body.plataformas
        }
    );

    const guardado= await nuevo.save();
    res.json(guardado);
});

app.put("/api/usuarios/:id", async(req, res)=>{

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero,
            plataformas: req.body.plataformas
        },
        {new:true}
    );
    res.json(usuarioActualizado);
});

app.listen(port, ()=>{
    console.log("Listening at http://localhost:3600");
});