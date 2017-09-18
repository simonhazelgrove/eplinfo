function GetApiAdaptor() {
    var api = GetApi();
    return {
        api: api,
        getTeam: function (teamId, success) {
            var jqXhr = self.api.getTeam(teamId,
                function (team) {
                    var newTeam = {
                        id: teamId,
                        name: team.name,
                        crestUrl: team.crestUrl,
                        streak: null
                    }
                    success(newTeam);
                });
            return jqXhr;
        },
        getTeams: function (leagueId, success) {
            var jqXhr = self.api.getTeams(leagueId,
                function (teams) {
                    var newTeams = _.map(teams.teams, function(team) {
                        return {
                            
                        }                        
                    });
                    success(newTeams);
                });
            return jqXhr;
        },
        getLeague: function (success) {
            var self = this;
            var league = {
                id: "",
                name: "",
                week: 0,
                table: null
            };
            var apiCompetition = null,
                apiLeagueTable = null,
                apiTeams = [];

            var jqXhrs = [];

            jqXhrs.push(self.api.getCompetition(function(competition) {
                apiCompetition = competition;
                jqXhrs.push(self.api.getLeagueTable(apiCompetition.id, function(leagueTable) {
                    apiLeagueTable = leagueTable;
                    _.forEach(apiLeagueTable.standing, function(standing) {
                        //jqXhrs.push(self.api.getTeam(standing.teamId, function(team) {
                        //    apiTeams.push(team);
                        //}));
                    })
                }));
            }));

            $.when.apply($, jqXhrs).then(function() {
                var results = arguments;
                league.id = apiCompetition.id;
                league.name = apiCompetition.caption;
                league.week = apiCompetition.currentMatchday;
                league.table = _.map(apiLeagueTable.standing,
                    function(apiTableRow, key) {
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
                    });

                success(league);
            });
        }

        //    getLeague: function (success) {
        //    var self = this;
        //    var league = {
        //        id: "",
        //        name: "",
        //        week: 0,
        //        table: null
        //    };
        //    self.api.getCompetition(function (competition) {
        //        league.id = competition.id;
        //        league.name = competition.caption;
        //        league.week = competition.currentMatchday;
        //        self.api.getLeagueTable(competition.id, function (table) {
        //            league.table = _.map(table.standing, function (tableRow, key) {
        //                var teamRow = {
        //                    row: key + 1,
        //                    teamId: tableRow.teamId,
        //                    teamName: tableRow.teamName,
        //                    playedGames: tableRow.playedGames,
        //                    goalDifference: tableRow.goalDifference,
        //                    points: tableRow.points
        //                }
        //                return teamRow;
        //            });
        //            success(league);
        //        });
        //    });
        //}
    }
}
