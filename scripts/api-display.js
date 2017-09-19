function GetApiDisplay(apiAdaptor) {
    return {
        apiAdaptor: apiAdaptor,
        tableElement: $("#league-table"),
        fixturesElement: $("#league-fixtures"),
        displayLeague: function () {
            var self = this;
            this.apiAdaptor.getData(function (data) {
                self.drawFixtures(data);
                self.drawTable(data);
            });
        },
        drawFixtures: function (data) {
            var self = this;
            var fixtureHtml = ""
            _.each(data.thisWeeksFixtures, function (fixture) {
                fixtureHtml += "<div>";
                fixtureHtml += fixture.homeTeam.name + " v " + fixture.awayTeam.name;
                fixtureHtml += "</div>";
            });
            self.fixturesElement.append(fixtureHtml);
        },
        drawTable: function(data) {
            var self = this;
            var tableHtml = "<table><tr><th>Pos</th><th>Team</th><th>Played</th><th>Home Streak</th><th>Away Streak</th><th>Diff</th><th>Points</th></tr>";
            _.each(data.table, function (tableItem) {
                tableHtml += "<tr><td>" +
                    tableItem.row + "</td><td>" +
                    tableItem.teamName + "</td><td>" +
                    tableItem.playedGames + "</td><td>" +
                    tableItem.team.homeStreak.type + tableItem.team.homeStreak.length + "</td><td>" +
                    tableItem.team.awayStreak.type + tableItem.team.awayStreak.length + "</td><td>" +
                    tableItem.goalDifference + "</td><td>" +
                    tableItem.points + "</td></tr>";
            });
            tableHtml += "</table>";
            self.tableElement.append(tableHtml);
        }
    }
}
