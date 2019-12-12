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


function getUserMetrics(game_id) {

  var metricsInfo = {
    game_id: game_id
  }

  $.post('/getMetrics', metricsInfo, res => {

    if (res.success) {
      let casual_competitive = $(`#casual_competitive${game_id}`)
      let short_long = $(`#short_long${game_id}`)
      let partner_team = $(`#partner_team${game_id}`)
      let strategic_gunblazer = $(`#strategic_gunblazer${game_id}`)
      let learn_lead = $(`#learn_lead${game_id}`)

      casual_competitive.val(res.user_metrics.casual_competitive)
      short_long.val(res.user_metrics.short_long)
      partner_team.val(res.user_metrics.partner_team)
      strategic_gunblazer.val(res.user_metrics.strategic_gunblazer)
      learn_lead.val(res.user_metrics.learn_lead)

      $(`#list-tab-${game_id} .list-group-item`).first().click()
    }
    else {
      let userMetricsDiv = $(`user-metrics-${game_id}`)
      userMetricsDiv.html(`<p class="display-4">${res.message}</p>`)
    }
  })
}


function getMatchMetrics(match_id, game_id) {

  var matchInfo = {
    match_id: match_id,
    game_id: game_id
  }

  $.post('/getMetrics', matchInfo, res => {

    if (res.success) {
      let casual_competitive = $(`#casual_competitive-match${game_id}`)
      let short_long = $(`#short_long-match${game_id}`)
      let partner_team = $(`#partner_team-match${game_id}`)
      let strategic_gunblazer = $(`#strategic_gunblazer-match${game_id}`)
      let learn_lead = $(`#learn_lead-match${game_id}`)
      let comment = $(`#comment-match${game_id}`)

      casual_competitive.val(res.user_metrics.casual_competitive)
      short_long.val(res.user_metrics.short_long)
      partner_team.val(res.user_metrics.partner_team)
      strategic_gunblazer.val(res.user_metrics.strategic_gunblazer)
      learn_lead.val(res.user_metrics.learn_lead)
      comment.text(res.user_metrics.comment)
    }
    else {
      console.log(res.message)
    }
  })
}