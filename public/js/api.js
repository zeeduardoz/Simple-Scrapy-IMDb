async function scrapingExe() {

 $('.loader').css({ 'display': 'block'})
 $('#list-movies').css({ 'display': 'none'})
 $('#list-movies').html('')

 let data = { list: [] }
 let list = $("textarea#list").val().split(', ')

 for (let i = 0; i < list.length; i++) {

  data.list.push(list[i])

 }

 const response = await axios.post('/getMovies', data)

 if (response.data.erro == true) {

  toastr["warning"](response.data.mensagem)

 } else {

  for (var m = 0; m < response.data.data.length; m++) {

   const movie = `<div id="movie">
     <div class="justify-content-start-between">
        <div class="movie__info">
          <img src="${response.data.data[m].capa}" title="${response.data.data[m].filme}">
          <div class="movie__text">
            <h2>${response.data.data[m].filme}</h2>
            <p>Avaliação: <b style="color: orange;">${response.data.data[m].avaliacao}</b></p>
            <p>Data de Lançamento: <b>${response.data.data[m].data_lancamento}</b></p>
            <a href="https://www.imdb.com${response.data.data[m].trailer}" target="blank" class="trailer"><i class="fas fa-play"></i>&nbsp;&nbspTrailer</a>
          </div>
        </div>

      <div class="justify-content-start-between" id="elenco-${m}">
      </div>
     </div>

     <hr>
     `

     document.getElementById('list-movies').innerHTML += movie

     response.data.data[m].elenco.forEach(e => {

      if (e.foto == null) {} else {

        const person = `
        <span>
          <a href="https://www.imdb.com${e.link}" target="blank">
            <img src="${e.foto}" width="200">
            <div>
              <p><b>${e.nome}</b></p>
              <p>"${e.personagem}"</p>

            </div>
          </a>
        </span>
        `

        document.getElementById(`elenco-${m}`).innerHTML += person

      }
  
     })

  }

  toastr["success"]('Scraping realizado com sucesso!')

  $('.loader').css({ 'display': 'none'})
  $('#list-movies').css({ 'display': 'block'})

 }

}