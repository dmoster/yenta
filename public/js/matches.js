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