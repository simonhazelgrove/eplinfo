function GetSimplePredictor() {
    return {
        name: "Simple",
        predict: function(fixture) {
            var self = this;
            var homeWin = fixture.homeTeam.tablePosition < fixture.awayTeam.tablePosition;
            var prediction = {
                predictorName: self.name,
                homeTeamScore: homeWin ? 1 : 0,
                awayTeamScore: homeWin ? 0 : 1
            }
            fixture.predictions.push(prediction);
        }
    };
}