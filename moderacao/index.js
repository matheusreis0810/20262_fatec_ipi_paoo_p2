const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const palavrasProibidas = ["morre", "final", "assassino", "traidor"]

const funcoes = {
    ComentarioCriado: (comentario) => {
        comentario.status = 'liberado'
        for(let palavra of palavrasProibidas){
            if(comentario.texto.includes(palavra)) comentario.status = 'spoiler'
        }
        axios.post('http://localhost:10000/eventos', {
            tipo: 'ComentarioModerado',
            dados: comentario
        })
    }
}

app.post('/eventos', (req, res) => {
    try{
        const evento = req.body
        console.log(evento)
        funcoes[evento.tipo](evento.dados)
    }
    catch(e){}
    res.end()
})

const port = 4300
app.listen(port, () => console.log(`Moderação. Porta ${port}.`))