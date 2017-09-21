function GetSimplePredictor() {
    return {
        name: "Streaker",
        predict: function(fixture) {
            var self = this;
            var homePos = this.applyStreakToPosition(fixture.homeTeam.tablePosition, fixture.homeTeam.homeStreak);
            var awayPos = this.applyStreakToPosition(fixture.awayTeam.tablePosition, fixture.awayTeam.awayStreak);
            var prediction = {
                predictorName: self.name,
                homeTeamScore: homePos <= awayPos ? 1 : 0,
                awayTeamScore: awayPos <= homePos ? 1 : 0
            }
            fixture.predictions.push(prediction);
        },
        applyStreakToPosition(position, streak) {
            if (streak.type == "W") {
                position += streak.length;
            } else if (streak.type == "L") {
                position -= streak.length;
            }
            return position;
        }
    };
}
