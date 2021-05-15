var express = require('express');
var router = express.Router();

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

router.get('/', (req, res) => {
 res.render('pages/index')
})

router.post('/getMovies', async (req, res) => {

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
           let capa = $('div[class="poster"] > a > img').attr('src');
           let trailer = $('div[class="videoPreview__videoContainer"] > a').attr('href');
       
           const data = {
             filme,
             avaliacao: avaliacao + ' ★',
             resumo,
             data_lancamento,
             capa,
             trailer,
             elenco: []
           }

       
           let cast = $('table.cast_list > tbody > tr')
       
            cast.each(function () {
       
             let nome = $(this).find('td.primary_photo > a > img').attr('title')
             let foto = $(this).find('td.primary_photo > a > img').attr('src')
             let personagem = $(this).find('.character > a').text()
             let link = $(this).find('td.primary_photo > a').attr('href')
       
             const element = {
               nome: nome,
               foto,
               personagem: personagem.replace('\n', ''),
               link
             }
       
             if (element.nome != '' || element.nome != undefined || element.foto != undefined || element.foto != 'null' || element.personagem != undefined || element.personagem != 'null') data.elenco.push(element)
       
           })

           
           array.push(data)

           console.log(data)
           
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

module.exports = router