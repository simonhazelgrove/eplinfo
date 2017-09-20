function GetApi() {
    var apiDisplay = GetApiDisplay();
    return {
        display: apiDisplay,
        key: "b947dad5dd8d4eccbb7439605a8d13ad",
        url: "https://api.football-data.org/v1/",
        get: function (path, success) {
            var self = this;
            self.display.showStatus("Loading " + path + "...")
            var cacheKey = "cache://" + path;
            var data = sessionStorage.getItem(cacheKey);
            if (data !== null) {
                success(JSON.parse(data));
                return null;
            } else {
                var jqXhr = $.ajax({
                    headers: { "X-Auth-Token": this.key },
                    url: this.url + path,
                    dataType: 'json',
                    type: 'GET',
                }).done(function(response) {
                    self.display.showStatus("Successfully loaded " + path)
                    sessionStorage.setItem(cacheKey, JSON.stringify(response));
                    success(response);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    self.display.showStatus("Failed to load " + path, true);
                    return null;
                });
                return jqXhr;
            }
        },
        getCompetition: function(success) {
            return this.get("competitions", function(competitions) {
                var competition = _.find(competitions, function (c) { return c.league == "PL" });
                success(competition);
            });
        },
        getLeagueTable: function (leagueId, success) {
            return this.get("competitions/" + leagueId + "/leagueTable", success);
        },
        getLeagueFixtures: function (leagueId, success) {
            return this.get("competitions/" + leagueId + "/fixtures", success);
        },
        getLeagueTeams: function (leagueId, success) {
            return this.get("competitions/" + leagueId + "/teams", success);
        }
    }
}
