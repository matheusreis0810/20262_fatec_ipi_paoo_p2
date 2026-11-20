const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

let id = 1
const series = {}

app.post("/series", (req, res) => {
    const { titulo, plataforma } = req.body

    if(!titulo || !plataforma){
        return res.status(400).json({  erro: "titulo e plataforma são obrigatórios" })
    }
    const serie = {
        id: id,
        titulo: titulo,
        plataforma: plataforma
    }
    series[id] = serie
    id++
    return res.status(201).json(serie)
})

app.get("/series", function(req, res){
    res.json(series)
})

const port = 4000
app.listen(port, () => {console.log(`Séries. Porta ${port}.`)})