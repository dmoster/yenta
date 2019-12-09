function addGame(id) {
  console.log('Adding game with ID', id)

  var casual_competitive = $(`#casual_competitive${id}`).val()
  var short_long = $(`#short_long${id}`).val()
  var partner_team = $(`#partner_team${id}`).val()
  var strategic_gunblazer = $(`#strategic_gunblazer${id}`).val()
  var learn_lead = $(`#learn_lead${id}`).val()
  var comment = $(`#comment${id}`).val()

  var gameMetrics = {
    game_id: id,
    casual_competitive: casual_competitive,
    short_long: short_long,
    partner_team: partner_team,
    strategic_gunblazer: strategic_gunblazer,
    learn_lead: learn_lead,
    comment: comment
  }

  $.post('/addGame', gameMetrics, res => {
    var resMsg = $(`#resMsg${id}`)

    if (res.success) {
      var gameAdderBtn = $(`#gameAdder${id}`)
      gameAdderBtn.prop('disabled', true)
      gameAdderBtn.text('Added')
      resMsg.addClass('text-success')
      resMsg.text('Game added successfully!')
    }
    else {
      resMsg.addClass('text-danger')
      resMsg.text('Game was not added. Please try again later.')
    }
  })
}


function removeGame(id) {
  var gameRemovalBtn = $(`#gameRemover${id}`)
  var gameCard = $(`#gameCard${id}`)

  $.post('/removeGame', id, res => {
    var resMsg = $(`#resMsg${id}`)

    if (res.success) {
      gameCard.fadeOut(() => { gameCard.remove() })
    }
    else {
      var resMsg = $(`#resMsg${id}`)
      resMsg.text('Cannot remove game at this time.')
    }
  })


}