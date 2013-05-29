function Team(id, name) {
    this.id = id
    this.name = name
    this.p = 0
    this.w = 0
    this.d = 0
    this.l = 0
    this.f = 0
    this.a = 0
    this.gd = 0
    this.pts = 0
    this.element = document.createElement('tr')
    this.element.id = 'team_' + id
    this.element.innerHTML = '<td>' + name + '</td>'
    var $p = this.element.appendChild(document.createElement('td'))
    var $w = this.element.appendChild(document.createElement('td'))
    var $d = this.element.appendChild(document.createElement('td'))
    var $l = this.element.appendChild(document.createElement('td'))
    var $f = this.element.appendChild(document.createElement('td'))
    var $a = this.element.appendChild(document.createElement('td'))
    var $gd = this.element.appendChild(document.createElement('td'))
    var $pts = this.element.appendChild(document.createElement('td'))
    this.updateDOM = function () {
        $p.innerHTML = this.p
        $w.innerHTML = this.w
        $d.innerHTML = this.d
        $l.innerHTML = this.l
        $f.innerHTML = this.f
        $a.innerHTML = this.a
        $gd.innerHTML = this.gd
        $pts.innerHTML = this.pts
    }

    this.updateDOM()

}
Team.prototype = {
    playGame: function (scored, against) {
        this.p++
        if (scored > against) {
            this.w++
            this.pts += 3
        }
        else if (against > scored) {
            this.l++
        }
        else {
            this.d++
            this.pts++
        }
        this.f += scored
        this.a += against
        this.gd += (scored - against)
        this.updateDOM()
    },
}
function LeagueTable() {
    this.dateShow = document.getElementById('curdate')
    this.setDate(new Date(2011, 7, 12))
    this.leagueTeams
    this.gamedays = []
    this.currStep = 0
    this.start_btn = document.getElementById('start_btn')
    this.pause_btn = document.getElementById('pause_btn')
    this.leagueTable = document.getElementById('leagueTable')

    this.loadTeams = function (teams) {
        this.leagueTeams = []
        this.leagueTable.innerHTML = ''
        for (var i = 0, j = teams.length; i < j; i++) {
            var team = new Team(teams[i].id, teams[i].name)
            this.leagueTeams.push(team)
            this.leagueTable.appendChild(team.element)
        }
    }
}
LeagueTable.prototype.setDate = function (date) {
    this.cur_date = date
    this.currStep++
    while (this.dateShow.childNodes.length >= 1) {
        this.dateShow.removeChild(this.dateShow.firstChild)
    }
    this.dateShow.appendChild(this.dateShow.ownerDocument.createTextNode(date.toLocaleDateString()))
}
LeagueTable.prototype.handleAnimation = function (end) {
    if (this.started) {
        window.clearInterval(this.started)
        this.started = false
        this.pause_btn.style.display = 'none'
        this.start_btn.style.display = ''
        if (end) {
            this.start_btn.firstElementChild.className = 'icon-refresh'
            this.start_btn.lastChild.textContent = ' Restart animation'
        }
    }
    else {
        this.started = setInterval(function () {
            leagueTable.animateTable()
        }, this.interval)
        this.start_btn.style.display = 'none'
        this.pause_btn.style.display = ''
        if (this.currStep === this.gamedays.length) {
            this.loadTeams(this.leagueTeams.sort(function (a, b) { return a.id - b.id }))
            this.currStep = 0
        }
    }
}
LeagueTable.prototype.findById = function (id) {
    for (var i = 0, j = this.leagueTeams.length; i < j; i++)
        if (this.leagueTeams[i].id === id)
            return this.leagueTeams[i]
    throw new Error('Team with ' + id + ' does not exist')
}
LeagueTable.prototype.animateTable = function () {
    if (this.currStep < this.gamedays.length) {
        var gameday = this.gamedays[this.currStep]
        var gamedate = gameday.date.match(/(\d+)/g)
        this.setDate(new Date(20 + gamedate[2], gamedate[1] - 1, gamedate[0]))
        for (var i = 0, j = gameday.games.length; i < j; i++) {
            var game = gameday.games[i]
            var home = this.findById(game.homeTeamId)
            var away = this.findById(game.awayTeamId)
            var homeGoals = Number(game.homeGoals)
            var awayGoals = Number(game.awayGoals)
            home.playGame(homeGoals, awayGoals)
            away.playGame(awayGoals, homeGoals)
        }
        this.setStanding()
    }
    else {
        this.handleAnimation(true)
    }
}
LeagueTable.prototype.setStanding = function () {
    var standing = this.leagueTeams.slice(0)
    this.leagueTeams.sort(function (a, b) {
        if (a.pts === b.pts) {
            if (a.gd === b.gd) {
                return b.f - a.f
            }
            return b.gd - a.gd
        }
        return b.pts - a.pts
    })
    for (var i = 0, j = this.leagueTeams.length; i < j; i++) {
        var team = this.leagueTeams[i]
        if (i < standing.indexOf(team))
            team.element.className = 'success'
        else if (i > standing.indexOf(team))
            team.element.className = 'error'
        else
            team.element.className = ''
        this.leagueTable.appendChild(team.element)
    }
}
var leagueTable = new LeagueTable()
function loadTeams(teams) {
    leagueTable.loadTeams(teams)
}
function loadGames(games) {
    var idx = 0
    while (idx < games.length) {
        var gameday = {}
        var daygames = []
        gameday.date = games[idx].date
        var dayidx = idx
        do {
            daygames.push(games[idx++])
        } while (games[idx] && games[dayidx].date === games[idx].date)
        gameday.games = daygames
        leagueTable.gamedays.push(gameday)
    }
    leagueTable.interval = 60000 / leagueTable.gamedays.length
}