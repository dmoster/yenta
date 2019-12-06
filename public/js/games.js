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

  console.log(gameMetrics)
}