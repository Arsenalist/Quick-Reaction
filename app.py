import requests
import json
from bs4 import BeautifulSoup
import os
from flask import Flask, request, jsonify, send_from_directory, render_template
app = Flask(__name__, static_url_path='')
app.Debug = True

@app.route('/scripts/<path:path>')
def send_js(path):
    return send_from_directory('scripts', path)

@app.route('/index.html')
def send_index():
    return render_template("index.html")


def get(uri):
  r = requests.get('https://api.thescore.com' + uri)
  if r.status_code == 200:
    return r.json()
  else:
    raise Exception("boom!")

class BoxScore:
  def __init__(self, overview, summaries, player_statistics, pitching_records, player_records):
    self.overview = overview
    self.summaries = summaries
    self.player_statistics = player_statistics
    self.pitching_records = pitching_records
    self.player_records = player_records

  def get_alignment(self, team_id):
    home_team_id = self.overview['event']['home_team']['id']
    away_team_id = self.overview['event']['away_team']['id']
    if team_id == home_team_id:
      return "home"
    if team_id == away_team_id:
      return "away"
    raise Exception("Could not determine alignment for " + str(team_id))


class Manager:
  def __init__(self, name, team, uri):
    self.name = name
    self.team = team
    self.image = ""
    self.uri = uri


class MLBStats:


  def get_hitter_stat_line(player):
    pass

class MLB:

  def get_teams(self):
    return get("/mlb/teams/")

  def get_managers(self):
    r = requests.get("http://espn.go.com/mlb/managers")
    soup = BeautifulSoup(r.text, "html.parser")
    rows = soup.select("table.tablehead tr.oddrow, table.tablehead tr.evenrow")
    managers = []
    for r in rows:
      tds = r.find_all('td')
      managers.append(Manager(tds[0].find("a").string, tds[3].find("a").string, "http://espn.go.com" + tds[0].find("a")["href"]))
    return managers

  def get_manager(self, team_name):
    managers = self.get_managers()
    manager = None
    for m in managers:
      if m.team == team_name:
        manager = m
        break
    if manager is None:
      raise Exception("Could not find manager for " + team_name)

    r = requests.get(manager.uri)
    soup = BeautifulSoup(r.text, "html.parser")
    manager.image = soup.select("table.tablehead tr td img")[0]["src"]
    return manager


  def find_latest_game_index_by_status(self, games, status):
    latest_index = -1
    i = 0;
    for g in games:
      if g["event_status"] == status:
        latest_index = i
      i = i + 1
    return latest_index

  def get_latest_box_score(self, team_id):
    r = requests.get("https://api.thescore.com/mlb/teams/" + str(team_id) + "/events/full_schedule?rpp=-1")
    games = r.json()
    latest_game_index = max(self.find_latest_game_index_by_status(games, 'in_progress'), self.find_latest_game_index_by_status(games, 'final'))
    latest_game = games[latest_game_index]["api_uri"]

    r = requests.get("https://api.thescore.com" + latest_game)
    game = r.json()
    box_score_uri = game["box_score"]["api_uri"]

    overview = requests.get("https://api.thescore.com" + box_score_uri).json()
    summaries = requests.get("https://api.thescore.com" + box_score_uri + "/summaries").json()
    player_statistics = requests.get("https://api.thescore.com" + box_score_uri + "/player_statistics").json()
    pitching_records = requests.get("https://api.thescore.com" + box_score_uri + "/pitching_records").json()
    player_records = requests.get("https://api.thescore.com" + box_score_uri + "/player_records?rpp=-1").json()

    return BoxScore(overview, summaries, player_statistics, pitching_records, player_records)


from flask import render_template





@app.route("/mlb/teams")
def get_teams():
    mlb = MLB()
    return jsonify(mlb.get_teams())

@app.route("/mlb/box/<id>")
def get_box(id):
  team_id = int(id)
  mlb = MLB()
  box = mlb.get_latest_box_score(team_id)
  alignment = box.get_alignment(team_id)

  relevant_pitching_records = []
  for p in box.pitching_records:
    if p["alignment"] == alignment:
      relevant_pitching_records.append(p)

  relevant_player_records = []
  for p in box.player_records:
    if p["alignment"] == alignment:
      relevant_player_records.append(p)

  manager = mlb.get_manager(box.overview["event"][alignment + "_team"]["full_name"])



  context = {
    "overview": box.overview,
    "summaries": box.summaries,
    "player_statistics": box.player_statistics[alignment], 
    "pitching_records": relevant_pitching_records,
    "player_records": relevant_player_records,
    "manager": manager.__dict__
  }


  return jsonify(context)


@app.route("/mlb/generate-reaction", methods=['POST'])
def generate_reaction():
  data = json.loads(request.form["data"])
  for key, value in data.iteritems() :
      print key

  battingSummaryHtml = None
  bullpenSummaryHtml = None
  managerHtml = None
  startingPitcherHtml = None
  
  if 'battingSummaryBlurb' in data['extra']:

      totals = [0] * len(data['player_records'])
      i = 0
      for p in data['player_records']:
        totals[i] = p['home_runs'] + p['runs_batted_in'] + p['runs'] + p['walks']
        i = i + 1

      biggestValue = 0
      biggestIndex = 0
      i = 0 
      for t in totals:
        if t > biggestValue:
          biggestIndex = i
          biggestValue = t
        i = i + 1

      battingSummaryHtml = render_template('mlb-hitter-summary.html', data=data['player_records'], 
        blurb=data['extra']['battingSummaryBlurb'], gradeImage=data['extra']['battingSummaryGrade'] if 'battingSummaryGrade' in data['extra'] else 'NA', 
        personImage=data['player_records'][biggestIndex]['player']['headshots']['w192xh192'])


  starter = None
  bullpen = []
  for p in data['pitching_records']:
    if p['sequence'] == 1:
      starter = p
    else:
      bullpen.append(p)


  if bullpen and 'bullpenSummaryBlurb' in data['extra']:
      bullpenSummaryHtml = render_template('mlb-pitching-summary.html', data=bullpen, 
        blurb=data['extra']['bullpenSummaryBlurb'], gradeImage=data['extra']['bullpenSummaryGrade'] if 'bullpenSummaryGrade' in data['extra'] else 'NA', 
        personImage=bullpen[0]['player']['headshots']['w192xh192'])



  if starter != None:
    stats = render_template('mlb-pitcher-stats.html', data=starter)
    if ('blurb' in starter and starter['blurb'] != ''):
      startingPitcherHtml = render_template('evaluation.html', stats=stats, blurb=starter['blurb'], gradeImage=starter['grade'] if'grade' in starter else 'NA',
        personName=starter['player']['first_initial_and_last_name'], personImage=starter['player']['headshots']['w192xh192'])


  pitchers = []
  for p in bullpen:
    if p['sequence'] != 1:
      stats = render_template('mlb-pitcher-stats.html', data=p)
      if ('blurb' in p and p['blurb'] != ''):
        evaluation = render_template('evaluation.html', stats=stats, blurb=p['blurb'], gradeImage=p['grade'] if'grade' in p else 'NA',
          personName=p['player']['first_initial_and_last_name'], personImage=p['player']['headshots']['w192xh192'])
        pitchers.append(evaluation)


  hitters = []  
  for p in data['player_records']:
    stats = render_template('mlb-hitter-stats.html', data=p)
    if ('blurb' in p and p['blurb'] != ''):
      evaluation = render_template('evaluation.html', stats=stats, blurb=p['blurb'], gradeImage=p['grade'] if'grade' in p else 'NA', 
        personName=p['player']['first_initial_and_last_name'], personImage=p['player']['headshots']['w192xh192'])
      hitters.append(evaluation)


  managerHtml = ''
  if 'managerBlurb' in data['extra']:
    manager = data['manager']
    managerHtml = render_template('evaluation.html', stats='', blurb=data['extra']['managerBlurb'], gradeImage=data['extra']['managerGrade'] if 'managerGrade' in data['extra'] else 'NA',
      personName=manager['name'], personImage=manager['image'])


  freeForm = []
  for x in range(0, 5):
    if 'freeForm' + str(x) in data['extra']:
      freeForm.append(data['extra']['freeForm' + str(x)])

  html = render_template('mlb-reaction.html', hitters=hitters, pitchers=pitchers, managerHtml=managerHtml,
   battingSummaryHtml=battingSummaryHtml, bullpenSummaryHtml=bullpenSummaryHtml, startingPitcherHtml=startingPitcherHtml, freeForm=freeForm)

  return jsonify({"html": html});

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)    
