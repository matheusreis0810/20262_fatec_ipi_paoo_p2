const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const baseConsulta = {}

atualizarComentario = (comentario) => {
    const comentarios = baseConsulta[comentario.serieId]['comentarios']
    const indice = comentarios.findIndex(c => c.id === comentario.id)
    comentarios[indice] = comentario
}

const funcoes = {
    SerieCriada: (serie) => {
        serie.comentarios = []
        baseConsulta[serie.id] = serie
    },
    ComentarioCriado: (comentario) => {
        const comentarios = baseConsulta[comentario.serieId]['comentarios'] || []
        comentarios.push(comentario)
        baseConsulta[comentario.serieId]['comentarios'] = comentarios
    },
    ComentarioAtualizado: atualizarComentario,
    ComentarioEditado: atualizarComentario
}

app.get('/series', (req, res) => {
    res.json(baseConsulta)
})

app.get('/series/:id', (req, res) => {
    if(!baseConsulta[req.params.id]){
        return res.status(404).json({ erro: "série não encontrada" })
    }
    res.json(baseConsulta[req.params.id])
})

app.post('/eventos', function(req, res){
    try{
        const evento = req.body
        console.log(evento)
        funcoes[evento.tipo](evento.dados)  
    }
    catch(e){}
    res.end()
})

const port = 4200
app.listen(port, () => console.log(`Consulta. ${port}.`))