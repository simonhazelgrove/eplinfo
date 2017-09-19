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
                id: self.apiCompetition.id,
                name: self.apiCompetition.caption,
                currentWeek: self.apiCompetition.currentMatchday,
                teams: _.map(self.apiTeams.teams, self.convertApiTeam),
                fixtures: _.map(self.apiFixtures.fixtures, self.convertApiFixture),
                table: _.map(self.apiLeagueTable.standing, self.convertApiTableRow),
                thisWeeksFixtures: null
            };
            self.createTeamStreaks(data);
            self.createTableTeams(data);
            self.createFixtureTeams(data);
            data.thisWeeksFixtures = _.where(data.fixtures, { week: data.currentWeek });
            success(data);
        },
        convertApiTeam: function (apiTeam, key) {
            var team = {
                id: key,
                name: apiTeam.name,
                homeStreak: null,
                awayStreak: null
            }
            return team;
        },
        convertApiFixture: function (apiFixture, key) {
            var fixture = {
                id: key,
                date: apiFixture.date,
                week: apiFixture.matchday,
                completed: apiFixture.status == "FINISHED",
                homeTeam: null,
                homeTeamName: apiFixture.homeTeamName,
                homeTeamScore: apiFixture.result.goalsHomeTeam,
                awayTeam: null,
                awayTeamName: apiFixture.awayTeamName,
                awayTeamScore: apiFixture.result.goalsAwayTeam,
            }
            return fixture;
        },
        convertApiTableRow: function (apiTableRow, key) {
            var tableRow = {
                row: key + 1,
                teamName: apiTableRow.teamName,
                team: null,
                playedGames: apiTableRow.playedGames,
                goalDifference: apiTableRow.goalDifference,
                points: apiTableRow.points
            }
            return tableRow;
        },
        createTeamStreaks: function (data) {
            var self = this;
            _.each(data.teams, function(team) {
                var homeResults = _.chain(data.fixtures)
                    .filter(function(fixture) { return fixture.homeTeamName == team.name && fixture.completed == true; })
                    .sortBy("week")
                    .value();
                var awayResults = _.chain(data.fixtures)
                    .filter(function(fixture) { return fixture.awayTeamName == team.name && fixture.completed == true; })
                    .sortBy("week")
                    .value();
                team.homeStreak = self.getStreakFromFixtures(homeResults);
                team.awayStreak = self.getStreakFromFixtures(awayResults);
            }, self)
        },
        getStreakFromFixtures: function(fixtures) {
            var streak = {
                type: "W",
                length: 0
            };
            return streak;
        },
        createTableTeams: function(data) {
            _.each(data.table, function (tableRow) {
                tableRow.team = _.findWhere(data.teams, { name: tableRow.teamName });
            })
        },
        createFixtureTeams: function(data) {
            _.each(data.fixtures, function (fixture) {
                fixture.homeTeam = _.findWhere(data.teams, { name: fixture.homeTeamName });
                fixture.awayTeam = _.findWhere(data.teams, { name: fixture.awayTeamName });
            })
        }
    }
}
