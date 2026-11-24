const HOST = 'localhost'
const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const palavrasProibidas = ["morre", "final", "assassino", "traidor"]

const moderar = (comentario) => {
    comentario.status = 'liberado'
    for(let palavra of palavrasProibidas){
        if(comentario.texto.includes(palavra)) comentario.status = 'spoiler'
    }
    axios.post(`http://${HOST}:10000/eventos`, {
        tipo: 'ComentarioModerado',
        dados: comentario
    })
}

const funcoes = {
    ComentarioCriado: moderar,
    ComentarioEditado: moderar
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
app.listen(port, async () => {
    console.log(`Moderação. Porta ${port}.`)
    try{
        const resp = await axios.get(`http://${HOST}:10000/eventos`)
        const ultimos = {}
        resp.data.forEach((evento) => {
            if(evento.tipo === 'ComentarioCriado' || evento.tipo === 'ComentarioEditado' || evento.tipo === 'ComentarioModerado'){
                ultimos[evento.dados.id] = evento
            }
        })
        resp.data.forEach((evento) => {
            if(ultimos[evento.dados.id] === evento && evento.tipo !== 'ComentarioModerado'){
                moderar(evento.dados)
            }
        })
    }
    catch(e){
        console.log('Barramento indisponível')
    }
})