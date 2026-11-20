const axios = require('axios')
const express = require('express')
const {v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json())

const comentariosPorSerieId = {}

app.post('/series/:id/comentarios', (req, res) => {
    const idComentario = uuidv4()
    const { texto } = req.body
    const comentario = {
        id: idComentario,
        texto: texto,
        serieId: req.params.id,
    }
    const comentariosDaSerie = comentariosPorSerieId[req.params.id] || []
    comentariosDaSerie.push(comentario)
    comentariosPorSerieId[req.params.id] = comentariosDaSerie
    return res.status(201).json(comentariosDaSerie)
})

app.get('/series/:id/comentarios', function(req, res){
    res.json(comentariosPorSerieId[req.params.id] || [])
})

const port = 4100
app.listen(port, () => console.log(`Comentários. Porta ${port}.`))