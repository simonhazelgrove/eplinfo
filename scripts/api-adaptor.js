function GetApiAdaptor() {
    var api = GetApi();
    return {
        api: api,
        apiCompetition: null,
        apiLeagueTable: null,
        apiTeams: null,
        apiFixtures: null,
        data: null,
        predictors: [],
        getData: function (success) {
            var self = this;
            var jqXhrs = [];

            var jqXhr = self.api.getCompetition(function(competition) {
                self.apiCompetition = competition;
            });

            $.when(jqXhr).then(function() {
                jqXhrs.push(self.api.getLeagueTable(self.apiCompetition.id,
                    function (leagueTable) {
                        self.apiLeagueTable = leagueTable;
                    }));
                jqXhrs.push(self.api.getLeagueFixtures(self.apiCompetition.id,
                    function (leagueFixtures) {
                        self.apiFixtures = leagueFixtures;
                    }));
                jqXhrs.push(self.api.getLeagueTeams(self.apiCompetition.id,
                    function (leagueTeams) {
                        self.apiTeams = leagueTeams;
                    }));

                $.when.apply($, jqXhrs).then(function () {
                    self.joinData(success);
                });
            });

        },
        joinData: function (success) {
            var self = this;
            self.data = {
                id: self.apiCompetition.id,
                name: self.apiCompetition.caption,
                currentWeek: self.apiCompetition.currentMatchday,
                totalWeeks: self.apiCompetition.numberOfMatchdays,
                teams: _.map(self.apiTeams.teams, self.convertApiTeam),
                fixtures: _.map(self.apiFixtures.fixtures, self.convertApiFixture),
                table: _.map(self.apiLeagueTable.standing, self.convertApiTableRow),
                getWeekFixtures: self.getWeekFixtures,
                adaptor: self
            };
            self.createTeamTablePositions(self.data);
            self.createTeamStreaks(self.data);
            self.createTableTeams(self.data);
            self.createFixtureTeams(self.data);
            success();
        },
        getWeekFixtures: function (week) {
            var self = this;
            var fixtures = _.where(this.fixtures, { week: parseInt(week) });
            _.each(fixtures, function(fixture) {
                fixture.predictions = [];
                _.each(self.adaptor.predictors, function (predictor) {
                    predictor.predict(fixture)
                });
            });
            return fixtures;
        },
        convertApiTeam: function (apiTeam, key) {
            var team = {
                id: key,
                name: apiTeam.name,
                homeStreak: null,
                awayStreak: null,
                tablePosition: null
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
                predictions: []
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
        createTeamTablePositions: function() {
            var self = this;
            _.each(self.data.teams, function (team) {
                team.tablePosition = _.findIndex(this.data.table, { teamName: team.name });
            }, self)
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
                team.homeStreak = self.getStreakFromFixtures(homeResults, team.name);
                team.awayStreak = self.getStreakFromFixtures(awayResults, team.name);
            }, self)
        },
        getStreakFromFixtures: function (fixtures, teamName) {
            var fixtureIndex = fixtures.length - 1;
            var streakType = this.getFixtureResult(fixtures[fixtureIndex], teamName);
            var streakLength = 0;
            if (streakType != "?") {
                do {
                    fixtureIndex--;
                    streakLength++;
                } while (fixtureIndex >= 0 && this.getFixtureResult(fixtures[fixtureIndex], teamName) == streakType);
            }
            return { 
                type: streakType,
                length: streakLength
            };
        },
        getFixtureResult: function(fixture, teamName) {
            var isHomeTeam = fixture.homeTeamName == teamName;
            if (fixture.homeTeamScore > fixture.awayTeamScore) {
                return isHomeTeam ? "W" : "L";
            } else if (fixture.homeTeamScore < fixture.awayTeamScore) {
                return isHomeTeam ? "L" : "W";
            } else if (fixture.homeTeamScore == fixture.awayTeamScore) {
                return "D";
            } else {
                return "?";
            }
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
