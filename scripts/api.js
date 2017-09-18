function GetApi() {
    return {
        key: "b947dad5dd8d4eccbb7439605a8d13ad",
        url: "https://api.football-data.org/v1/",
        get: function (path, success) {
            $("#status").text("Loading " + path + "...");
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
                    $("#status").text("Successfully loaded " + path);
                    sessionStorage.setItem(cacheKey, JSON.stringify(response));
                    success(response);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $("#status").text("Failed to load " + path);
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
        getTeam: function (teamId, success) {
            return this.get("teams/" + teamId, success);
        },
        getTeamFixtures: function(teamId, success) {
            return this.get("teams/" + teamId + "/fixtures", success);
        }
    }
}
