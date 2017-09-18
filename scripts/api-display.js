function GetApiDisplay(apiAdaptor) {
    return {
        apiAdaptor: apiAdaptor,
        tableElement: $("#league-table"),
        displayLeague: function () {
            var self = this;
            this.apiAdaptor.getData(function(data) {
                var tableHtml = "<table><tr><th>Pos</th><th>Team</th><th>Played</th><th>Diff</th><th>Points</th></tr>";
                _.forEach(data.table, function (tableItem) {
                    tableHtml += "<tr><td>" + tableItem.row + "</td><td>" + tableItem.teamName + "</td><td>" + tableItem.playedGames + "</td><td>" + tableItem.goalDifference + "</td><td>" + tableItem.points + "</td></tr>";
                });
                tableHtml += "</table>";
                self.tableElement.append(tableHtml);
            });
        }
    }
}
