function GetApiAdaptor() {
    var api = GetApi();
    return {
        api: api,
        apiCompetition: null,
        apiLeagueTable: null,
        apiTeams: null,
        apiFixtures: null,
        getData: function (success) {
            var self = this;
            var jqXhrs = [];

            jqXhrs.push(self.api.getCompetition(function(competition) {
                self.apiCompetition = competition;
                jqXhrs.push(self.api.getLeagueTable(self.apiCompetition.id,
                    function(leagueTable) {
                        self.apiLeagueTable = leagueTable;
                    }));
                jqXhrs.push(self.api.getLeagueFixtures(self.apiCompetition.id,
                    function(leagueFixtures) {
                        self.apiFixtures = leagueFixtures;
                    }));
                jqXhrs.push(self.api.getLeagueTeams(self.apiCompetition.id,
                    function(leagueTeams) {
                        self.apiTeams = leagueTeams;
                    }));
            }));

            $.when.apply($, jqXhrs).then(function() {
                self.joinData(success);
            });
        },
        joinData: function (success) {
            var self = this;
            var data = {
                id: "",
                name: "",
                week: 0,
                table: null
            };
            data.id = self.apiCompetition.id;
            data.name = self.apiCompetition.caption;
            data.week = self.apiCompetition.currentMatchday;
            data.table = _.map(self.apiLeagueTable.standing, self.convertApiTableRow);

            success(data);
        },
        convertApiTableRow: function (apiTableRow, key) {
            var teamRow = {
                row: key + 1,
                teamId: apiTableRow.teamId,
                teamName: apiTableRow.teamName,
                team: null,
                playedGames: apiTableRow.playedGames,
                goalDifference: apiTableRow.goalDifference,
                points: apiTableRow.points
            }
            return teamRow;
        }
    }
}
