const axios = require('axios')
const express = require('express')
const {v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json())

const comentariosPorSerieId = {}

app.post('/series/:id/comentarios', async (req, res) => {
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
    await axios.post('http://localhost:10000/eventos', {
        tipo: 'ComentarioCriado',
        dados: comentario
    })
    return res.status(201).json(comentariosDaSerie)
})

app.get('/series/:id/comentarios', function(req, res){
    res.json(comentariosPorSerieId[req.params.id] || [])
})

app.post('/eventos', (req, res) => {
    const evento = req.body
    console.log(evento.tipo)
    res.end()
})

const port = 4100
app.listen(port, () => console.log(`Comentários. Porta ${port}.`))