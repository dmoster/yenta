function selectGame() {

  if (document.location.search) {
    let urlParams = getQueryParams()

    if (urlParams.game_id) {
      $(`#gameSelector${urlParams.game_id}`).click()
    }
  }
  else {
    $('.list-group-item').first().click()
  }

}


function getQueryParams(str) {
  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}


function getMetrics(match_id, game_id) {

  var matchInfo = {
    match_id: match_id,
    game_id: game_id
  }

  $.post('/getMetrics', matchInfo, res => {

    if (res.success) {
      $(`#user-metrics-${<%= game.id %>}`).text() += JSON.stringify(res)
    
      console.log(res)
    }
    else {
      console.log(res.message)
    }
  })
}