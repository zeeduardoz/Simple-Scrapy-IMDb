'use strict'

const express = require('express')
const app = express();
const http = require('http').Server(app)
const fs = require('fs')

const bodyParser = require('body-parser')
const axios = require('axios')
const cheerio = require('cheerio')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine");

app.get('/', async (req, res) => {

 try {

  const response = await axios.get(`https://imdb.com/title/${req.query.id}`)

  if (response.status == 200) {

    const html = response.data;
    const $ = cheerio.load(html);

    let filme = $('div[class="title_wrapper"] > h1').text().trim();
    let avaliacao = $('div[class="ratingValue"] > strong > span').text();
    let resumo  = $('div[class="summary_text"]').text().trim();
    let data_lancamento = $('a[title="See more release dates"]').text().trim();
    let elenco_estrelas = $('div.credit_summary_item:nth-child(3) > a:nth-child(-n+3)').text()

    const data = {
      filme,
      avaliacao: avaliacao + ' ★',
      resumo,
      data_lancamento,
      elenco_estrelas,
      elenco: []
    }

    let cast = $('table.cast_list > tbody > tr')

    cast.each(function () {

      let nome = $(this).find('td:nth-child(2) > a').text()
      let foto = $(this).find('.primary_photo > a > img').attr('src')
      let personagem = $(this).find('.character > a').text()

      const element = {
        nome: nome.replace('\n', ''),
        foto,
        personagem: personagem.replace('\n', ''),
      }

      if (element.nome != '' || element.nome != undefined || element.foto != undefined || element.foto != 'null' || element.personagem != undefined || element.personagem != 'null') data.elenco.push(element)
      
    })

    var id = Math.floor(Math.random() * 1000000000) + 1;

    fs.writeFileSync(`./outputs/${id}.json`, JSON.stringify(data, null, 2));
    console.log('\x1b[32m', `\nScrapy realizado com sucesso! Abra o arquivo "${id}.json"`)
    return res.send({erro: false, status: 200, data})

  } else {

    console.log('\x1b[31m', `\nCódigo do filme não encontrado! - #${Math.random}`)
    return res.send({erro: true, status: 404, mensagem: 'Código do filme não encontrado!'})

  }

 } catch (e) {

  console.log('\x1b[31m', `\nOcorreu um erro (${e})`)
  return res.send({erro: true, status: 500, mensagem: 'Ocorreu um erro na requisição!'})

 }

})

app.post('/getList', async (req, res) => {

  try {

    const listID = req.body.list

    if (listID[0] != null) {

      const array = []

      for(var i = 0; i < listID.length; i++) {

        try {
    
          const response = await axios.get(`https://imdb.com/title/${req.body.list[i]}`)
        
          if (response.status == 200) {
        
            const html = response.data;
            const $ = cheerio.load(html);
        
            let filme = $('div[class="title_wrapper"] > h1').text().trim();
            let avaliacao = $('div[class="ratingValue"] > strong > span').text();
            let resumo  = $('div[class="summary_text"]').text().trim();
            let data_lancamento = $('a[title="See more release dates"]').text().trim();
            let elenco_estrelas = $('div.credit_summary_item:nth-child(3) > a:nth-child(-n+3)').text()
        
            const data = {
              filme,
              avaliacao: avaliacao + ' ★',
              resumo,
              data_lancamento,
              elenco_estrelas,
              elenco: []
            }
        
            let cast = $('table.cast_list > tbody > tr')
        
            cast.each(function () {
        
              let nome = $(this).find('td:nth-child(2) > a').text()
              let foto = $(this).find('.primary_photo > a > img').attr('src')
              let personagem = $(this).find('.character > a').text()
        
              const element = {
                nome: nome.replace('\n', ''),
                foto,
                personagem: personagem.replace('\n', ''),
              }
        
              if (element.nome != '' || element.nome != undefined || element.foto != undefined || element.foto != 'null' || element.personagem != undefined || element.personagem != 'null') data.elenco.push(element)
        
            })
      
            array.push(data)
        
          } else {
        
            console.log('\x1b[31m', `\nCódigo do filme não encontrado! - #${Math.random}`)
            return res.send({erro: true, status: 404, mensagem: 'Código do filme não encontrado!'})
        
          }
        
        } catch (e) {
        
          console.log('\x1b[31m', `\nOcorreu um erro (${e})`)
          return res.send({erro: true, status: 500, mensagem: 'Ocorreu um erro na requisição!'})
        
        }
    
      }

      var id = Math.floor(Math.random() * 1000000000) + 1;

      fs.writeFileSync(`./outputs/${id}.json`, JSON.stringify(array, null, 2));
      console.log('\x1b[32m', `\nScrapy realizado com sucesso! Abra o arquivo "${id}.json"`)
      return res.send({erro: false, status: 200, data: array})

    } else {

      console.log('\x1b[31m', `\nLista nula! (${e})`)
      return res.send({erro: true, status: 500, mensagem: 'Deve conter pelo menos um ID!'})

    }
  
  } catch (e) {

    console.log('\x1b[31m', `\nOcorreu um erro (${e})`)
    return res.send({erro: true, status: 500, mensagem: 'Ocorreu um erro na requisição!'})

  }
 
 })

http.listen(3000, () => console.log('\x1b[32m', `\n[Scraping] ➟  Aplicação scraping API iniciada!`))

