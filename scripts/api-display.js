function GetApiDisplay() {
    return {
        tableElement: $("#league-table"),
        fixturesElement: $("#league-fixtures"),
        weekSelect: $("#week-select"),
        prevWeekButton: $("#prev-week-button"),
        nextWeekButton: $("#next-week-button"),
        title: $("#title"),
        statusBar: $("#status"),
        displayLeague: function (data) {
            this.title.text(data.name);
            this.bindWeekSelect(data);
            this.bindNextAndPrevWeekButtons(data);
            this.drawTable(data);
        },
        bindWeekSelect: function (data) {
            var self = this;
            this.weekSelect.empty();
            for (var i = 1; i <= data.totalWeeks; i++) {
                var option = $("<option></option>").attr("value", i).text(i);
                this.weekSelect.append(option);
            }
            this.weekSelect.change(function() {
                var week = self.weekSelect.val();
                self.drawFixtures(data, week);
            });
            this.weekSelect.val(data.currentWeek);
            this.weekSelect.change();
        },
        bindNextAndPrevWeekButtons: function (data) {
            var self = this;
            this.prevWeekButton.click(function () {
                var week = parseInt(self.weekSelect.val());
                if (week > 1) {
                    self.weekSelect.val(week - 1);
                    self.weekSelect.change();
                }
            });
            this.nextWeekButton.click(function () {
                var week = parseInt(self.weekSelect.val());
                if (week < data.totalWeeks) {
                    self.weekSelect.val(week + 1);
                    self.weekSelect.change();
                }
            });
        },
        drawFixtures: function (data, week) {
            var self = this;
            var fixtureHtml = "<div class='container'>";
            var fixtures = data.getWeekFixtures(week);
            _.each(fixtures, function (fixture) {
                fixtureHtml += "<div class='row row-striped'>";
                fixtureHtml += "<div class='col-sm-4'>" + fixture.homeTeam.name + " v " + fixture.awayTeam.name + "</div>";
                if (fixture.completed) {
                    fixtureHtml += "<div class='col-sm-2'>Final Score:<br/> " + fixture.homeTeamScore + " : " + fixture.awayTeamScore + "</div>";
                }
                fixtureHtml += "<div class='col-sm-6'>";
                _.each(fixture.predictions, function(prediction) {
                    fixtureHtml += "<div class='container'><div class='row'>";
                    fixtureHtml += "<div class='col-sm-6'>" + prediction.predictorName + "</div>"
                    fixtureHtml += "<div class='col-sm-4'>" + prediction.homeTeamScore + " : " + prediction.awayTeamScore + "</div>";
                    if (fixture.completed) {
                        fixtureHtml += "<div class='col-sm-2'>";
                        if ((fixture.homeTeamScore < fixture.awayTeamScore && prediction.homeTeamScore < prediction.awayTeamScore)
                           || (fixture.homeTeamScore > fixture.awayTeamScore && prediction.homeTeamScore > prediction.awayTeamScore)
                           || (fixture.homeTeamScore === fixture.awayTeamScore && prediction.homeTeamScore === prediction.awayTeamScore)) {
                            fixtureHtml += "<span class='text-success'>&nbsp;&#10004;</span>";
                        } else {
                            fixtureHtml += "<span class='text-danger'>&nbsp;&#10008;</span>";
                        }
                        fixtureHtml += "</div>";
                    }
                    fixtureHtml += "</div></div>";
                });
                fixtureHtml += "</div>";
                fixtureHtml += "</div>";
            });
            fixtureHtml += "</div>";
            self.fixturesElement.empty().append(fixtureHtml);
        },
        drawTable: function(data) {
            var self = this;
            var tableHtml = "<table class='table table-striped table-responsive'><thead class='thead-inverse'><tr><th>Pos</th><th>Team</th><th>Played</th><th>Home Streak</th><th>Away Streak</th><th>Diff</th><th>Points</th></tr></thead><tbody>";
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
            tableHtml += "</tbody></table>";
            self.tableElement.empty().append(tableHtml);
        },
        showStatus: function (message, isError) {
            this.statusBar.text(message);
            if (isError) {
                this.statusBar.removeClass("alert-secondary").addClass("alert-danger");
            }
        },
        hideStatus: function() {
            this.statusBar.slideUp();
        }
    }
}
