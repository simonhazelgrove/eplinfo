/* Predicts games by looking at table position of team, and adjusting it by the length of streak they are having for home/away games. */
/* Away streak of 3 means away team will be adjusted up table position by three places. */
function GetStreakerPredictor() {
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
