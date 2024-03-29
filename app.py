import requests
import json
from bs4 import BeautifulSoup
import os
from flask import Flask, request, jsonify, send_from_directory, render_template
from wordpress_xmlrpc import Client, WordPressPost
from wordpress_xmlrpc.methods.posts import NewPost
from wordpress_xmlrpc.methods import posts, taxonomies, users
import datetime
from dotmap import DotMap

APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top

app = Flask(__name__, static_url_path='')
app.debug = True
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

@app.route('/scripts/<path:path>')
def send_js(path):
    return send_from_directory('scripts', path)

@app.route('/index.html')
@app.route('/')
def send_index():
    return render_template("index.html")

import re
from jinja2 import evalcontextfilter, Markup, escape

_paragraph_re = re.compile(r'(?:\r\n|\r|\n){2,}')

@evalcontextfilter
def nl2br(eval_ctx, value):
    result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', Markup('<br>\n'))
                          for p in _paragraph_re.split(escape(value)))
    if eval_ctx.autoescape:
        result = Markup(result)
    return result


def get(uri):
  r = requests.get('https://api.thescore.com' + uri)
  if r.status_code == 200:
    return r.json()
  else:
    raise Exception("boom!")

app.jinja_env.filters['nl2br'] = nl2br


class TheScore:

  def find_latest_game(self, team_uri):
    games = get(team_uri + "/events/full_schedule?rpp=-1")
    status = ["in_progress", "final"]
    latest_index = -1
    i = 0;
    for g in games:
      if g["event_status"] in status:
        latest_index = i
      i = i + 1
    return games[latest_index]

  def get_alignment(self, box_score, team_id):
    home_team_id = box_score['event']['home_team']['id']
    away_team_id = box_score['event']['away_team']['id']
    if team_id == home_team_id:
      return "home"
    if team_id == away_team_id:
      return "away"
    raise Exception("Could not determine alignment for " + str(team_id))

  def filter_by_alignment(self, records, alignment):
    filtered_records = []
    for r in records:
      if r["alignment"] == alignment:
        filtered_records.append(r)
    return filtered_records

  def get_previous_games(self, team_uri, count=3):
    return get(team_uri + "/events/previous?rpp=" + str(count))

  def get_upcoming_games(self, team_uri, count=1):
    return get(team_uri + "/events/upcoming?rpp=1" + str(count))

  def get_next_game(self, team_uri):
    upcoming = self.get_upcoming_games(team_uri, 1)
    if len(upcoming) > 0:
      return upcoming[0]
    else:
      return None


class NBA(TheScore):

  coach_mapping = {
    5: {'image': 'https://i.imgur.com/QkbchIz.jpg', 'name': 'Nick Nurse'},
    'tor': {'image': 'https://i.imgur.com/QkbchIz.jpg', 'name': 'Nick Nurse'}
  }

  def get_teams(self):
    return requests.post('https://nbaapi.raptorsrepublic.com/teams').json()

  def get_coach(self, team_id):
    if team_id not in self.coach_mapping:
      return None
    return self.coach_mapping[team_id]

  def get_latest_box_score(self, team_id):
    return requests.get('https://nbaapi.raptorsrepublic.com/nba/box/' + str(team_id)).json()
    # latest_game = self.find_latest_game('/nba/teams/' + str(team_id))
    # game = get(latest_game["api_uri"])
    # box_score_uri = game["box_score"]["api_uri"]
    # return {
    #   'overview': get(box_score_uri),
    #   'player_records': get(box_score_uri + '/player_records?rpp=-1')
    # }


class MLS(TheScore):

  def get_teams(self):
    return get('/mls/teams/')


  def get_latest_box_score(self, team_id):
    latest_game = self.find_latest_game('/mls/teams/' + str(team_id))
    game = get(latest_game["api_uri"])
    box_score_uri = game["box_score"]["api_uri"]

    return {
      'overview': get(box_score_uri),
      'player_records': get(box_score_uri + '/player_records?rpp=-1'),
      'goalie_records': get(box_score_uri + '/goalie_records?rpp=-1')
    }


class BoxScore:
  def __init__(self, overview, summaries, player_statistics, pitching_records, player_records):
    self.overview = overview
    self.summaries = summaries
    self.player_statistics = player_statistics
    self.pitching_records = pitching_records
    self.player_records = player_records


class Manager:
  def __init__(self, name, team, uri):
    self.name = name
    self.team = team
    self.image = ""
    self.uri = uri


class MLB(TheScore):

  def get_teams(self):
    return get("/mlb/teams/")

  def get_starter(self, pitching_records):
    for p in pitching_records:
      if p['sequence'] == 1:
        return p
    raise Exception("No starter found.")

  def get_bullpen(self, pitching_records):
    bullpen = []
    for p in pitching_records:
      if p['sequence'] != 1:
        bullpen.append(p)
    return bullpen


  def get_player_with_most_bases(self, player_records):
      totals = [0] * len(player_records)
      i = 0
      for p in player_records:
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

      return player_records[biggestIndex]

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


  def get_latest_box_score(self, team_id):
    latest_game = self.find_latest_game('/mlb/teams/' + str(team_id))
    game = get(latest_game["api_uri"])
    box_score_uri = game["box_score"]["api_uri"]

    overview = requests.get("https://api.thescore.com" + box_score_uri).json()
    summaries = requests.get("https://api.thescore.com" + box_score_uri + "/summaries").json()
    player_statistics = requests.get("https://api.thescore.com" + box_score_uri + "/player_statistics").json()
    pitching_records = requests.get("https://api.thescore.com" + box_score_uri + "/pitching_records").json()
    player_records = requests.get("https://api.thescore.com" + box_score_uri + "/player_records?rpp=-1").json()

    # add won/loss info to pitching_records
    for p in pitching_records:
      record = ''
      if p["game_lost"]:
        record = record + 'L, '
      if p["game_won"]:
        record = record + 'W, '
      if p["game_saved"]:
        record = record + 'S, '
      record = record + str(p["wins"]) + "-" + str(p["losses"])
      p["record"] = record

    return BoxScore(overview, summaries, player_statistics, pitching_records, player_records)


from flask import render_template

def get_aligned_mls_box_score(team_id):
  mls = MLS()
  box = mls.get_latest_box_score(team_id)
  alignment = mls.get_alignment(box['overview'], team_id)

  relevant_player_records = mls.filter_by_alignment(box['player_records'], alignment)
  relevant_goalie_records = mls.filter_by_alignment(box['goalie_records'], alignment)

  context = {
    "overview": box['overview'],
    "player_records": relevant_player_records,
    "goalie_records": relevant_goalie_records
  }
  return context


def get_aligned_nba_box_score(team_id):
  nba = NBA()
  box = nba.get_latest_box_score(team_id)
  alignment = nba.get_alignment(box['overview'], team_id)

  relevant_player_records = nba.filter_by_alignment(box['player_records'], alignment)
  coach = nba.get_coach(team_id)

  context = {
    "overview": box['overview'],
    "player_records": relevant_player_records,
    "manager": coach
  }

  return context

def get_aligned_box_score(team_id):

  mlb = MLB()
  box = mlb.get_latest_box_score(team_id)
  alignment = mlb.get_alignment(box.overview, team_id)

  relevant_pitching_records = mlb.filter_by_alignment(box.pitching_records, alignment)
  relevant_player_records = mlb.filter_by_alignment(box.player_records, alignment)

  manager = mlb.get_manager(box.overview["event"][alignment + "_team"]["full_name"])

  context = {
    "overview": box.overview,
    "summaries": box.summaries,
    "player_statistics": box.player_statistics[alignment],
    "pitching_records": relevant_pitching_records,
    "player_records": relevant_player_records,
    "manager": manager.__dict__
  }
  return context


def get_mls_preview_data(team_id):
  mls = MLS()
  team_uri = "/mls/teams/" + str(team_id)
  next_game = mls.get_next_game(team_uri)
  if next_game == None:
    raise Exception("No next game for " + str(team_id))

  context = {
    "next_game": next_game,
    "home_team": get(next_game['home_team']['api_uri']),
    "away_team": get(next_game['away_team']['api_uri']),
    "home_previous_games": mls.get_previous_games(next_game['home_team']['api_uri']),
    "away_previous_games": mls.get_previous_games(next_game['away_team']['api_uri']),
    'event_details': get(next_game['resource_uri'])
  }

  return context

@app.route("/mls/preview/<int:team_id>")
def get_mls_team_preview(team_id):
  return jsonify(get_mls_preview_data(team_id))



def get_list_from_params(prefix, dict):
  l = []
  for x in range(1, 11):
    k = prefix + str(x)
    if k in dict:
      l.append(dict[k])

  return l

@app.route("/mls/generate-preview", methods=['POST'])
def generate_mlb_preview():
  payload = json.loads(request.form["data"])
  team_id = int(payload["team_id"])
  evaluation = payload['evaluation']
  blurbs = evaluation['blurbs']
  print(blurbs)



  data = get_mls_preview_data(team_id)

  html = render_template('mlb-preview.html', data=data, blurbs=blurbs,
    gameNotes=get_list_from_params('gameNotes', blurbs),
    winningKeys=get_list_from_params('winIf', blurbs),
    losingKeys=get_list_from_params('loseIf', blurbs)
    )

  return jsonify({"html": html});






@app.route("/teams", methods=['POST'])
def get_teams():
    league = request.form["league"]
    if league == 'mlb':
      mlb = MLB()
      return jsonify(mlb.get_teams())
    elif league == 'mls':
      mls = MLS()
      return jsonify(mls.get_teams())
    elif league == 'nba':
      nba = NBA()
      return jsonify(nba.get_teams())


@app.route("/mls/box/<id>")
def get_mls_box(id):
  context = get_aligned_mls_box_score(int(id))
  return jsonify(context)

@app.route("/nba/box/<id>")
def get_nba_box(id):
  context = get_aligned_nba_box_score(id)
  return jsonify(context)


@app.route("/mlb/box/<id>")
def get_mlb_box(id):
  context = get_aligned_box_score(int(id))
  return jsonify(context)

def read_file(file_name):
  f = open(file_name)
  contents = f.read()
  f.close()
  return contents

def get_config():
  config_text = os.environ.get('QUICK_REACTION_CONFIG', read_file(os.path.join(APP_ROOT, 'config/config.json')))
  return json.loads(config_text)

def create_wordpress_draft(publish_target, title, html, tags):
  post = WordPressPost()
  today = datetime.date.today()
  post.title = title
  post.content = html
  client = Client( publish_target["url"] + "/xmlrpc.php",  publish_target["username"],  publish_target["password"])
  category = client.call(taxonomies.GetTerm('category',  publish_target["default_category_id"]))
  post.terms.append(category)
  post.user = publish_target["default_user_id"]
  post.terms_names = {'post_tag': tags}
  post.comment_status = 'open'
  post.id = client.call(posts.NewPost(post))
  return post

def get_publish_options_by_type(type):
  prefix = type.split("-")[0]
  config = get_config()
  return config[prefix]


@app.route("/publish-options/<type>")
def get_publish_options(type):
  publish_options = get_publish_options_by_type(type)
  publish_options_cleaned = []
  for p in publish_options:
    publish_options_cleaned.append({'id': p['id'], 'name': p['name']})

  return jsonify(publish_options_cleaned)

@app.route("/create-draft", methods=['POST'])
def create_draft():
  data = DotMap(json.loads(request.form["data"]))
  publish_options = get_publish_options_by_type(data.type)
  publish_target = None
  publishTargetId = request.form["publishTarget"]
  for p in publish_options:
    if p['id'] == publishTargetId:
      publish_target = p
      break

  if publish_target == None:
    raise "No publish target found."

  if data.type == 'mlb-reaction':
    title = 'Quick Reaction: ' + data.context.event.away_team.full_name + ' ' + str(data.context.away_score_runs) + ', ' + data.context.event.home_team.full_name + ' ' + str(data.context.home_score_runs)
    tags = [data.context.event.home_team.full_name, data.context.event.away_team.full_name]
    post = create_wordpress_draft(publish_target, title, data.html, tags)
    return jsonify({"status": "OK", "url": publish_target['url'] + "/wp-admin/post.php?post=" + post.id + "&action=edit"})

  elif data.type == 'mls-reaction':
    title = 'Quick Reaction: ' + data.context.event.home_team.full_name + ' ' + str(data.context.score.home.score) + ', ' + data.context.event.away_team.full_name + ' ' + str(data.context.score.away.score)
    tags = [data.context.event.home_team.full_name, data.context.event.away_team.full_name]
    post = create_wordpress_draft(publish_target, title, data.html, tags)
    return jsonify({"status": "OK", "url": publish_target['url'] + "/wp-admin/post.php?post=" + post.id + "&action=edit"})

  elif data.type == 'nba-reaction':
    title = 'Quick Reaction: ' + data.context.event.home_team.full_name + ' ' + str(data.context.score.home.score) + ', ' + data.context.event.away_team.full_name + ' ' + str(data.context.score.away.score)
    tags = [data.context.event.home_team.full_name, data.context.event.away_team.full_name]
    post = create_wordpress_draft(publish_target, title, data.html, tags)
    return jsonify({"status": "OK", "url": publish_target['url'] + "/wp-admin/post.php?post=" + post.id + "&action=edit"})

  elif data.type == 'mls-preview':
    title = 'Match Preview: ' + data.context.home_team.full_name + ' vs ' + data.context.away_team.full_name
    tags = [data.context.home_team.full_name, data.context.away_team.full_name]
    post = create_wordpress_draft(publish_target, title, data.html, tags)
    return jsonify({"status": "OK", "url": publish_target['url'] + "/wp-admin/post.php?post=" + post.id + "&action=edit"})


def apply_evaluation(evaluation, records):
  for p in records:
    p['blurb'] = evaluation['blurbs'][str(p['id'])] if str(p['id']) in evaluation['blurbs'] else None
    p['grade'] = evaluation['grades'][str(p['id'])] if str(p['id']) in evaluation['grades'] else None
  return records

@app.route("/mlb/generate-reaction", methods=['POST'])
def generate_reaction():
  payload = json.loads(request.form["data"])
  evaluation = payload['evaluation']
  blurbs = evaluation['blurbs']
  grades = evaluation['grades']

  data = get_aligned_box_score(int(payload['team_id']))
  mlb = MLB()
  battingSummaryHtml = None
  bullpenSummaryHtml = None
  managerHtml = None
  startingPitcherHtml = None

  data['pitching_records'] = apply_evaluation(evaluation, data['pitching_records'])
  data['player_records'] = apply_evaluation(evaluation, data['player_records'])

  starter = mlb.get_starter(data['pitching_records'])
  bullpen =  mlb.get_bullpen(data['pitching_records'])


  if 'battingSummaryBlurb' in blurbs:
      most_bases = mlb.get_player_with_most_bases(data['player_records'])
      battingSummaryHtml = render_template('mlb-hitter-summary.html', data=data['player_records'],
        blurb=blurbs['battingSummaryBlurb'], gradeImage=grades['battingSummaryGrade'] if 'battingSummaryGrade' in grades else None,
        personImage=most_bases['player']['headshots']['w192xh192'])

  if bullpen and 'bullpenSummaryBlurb' in blurbs:
      bullpenSummaryHtml = render_template('mlb-pitching-summary.html', data=bullpen,
        blurb=blurbs['bullpenSummaryBlurb'], gradeImage=grades['bullpenSummaryGrade'] if 'bullpenSummaryGrade' in grades else None,
        personImage=bullpen[0]['player']['headshots']['w192xh192'])

  if ('blurb' in starter and starter['blurb'] != None):
    stats = render_template('mlb-pitcher-stats.html', data=starter)
    startingPitcherHtml = render_template('evaluation.html', stats=stats, blurb=starter['blurb'], gradeImage=starter['grade'] if'grade' in starter else None,
      personName=starter['player']['first_initial_and_last_name'], personImage=starter['player']['headshots']['w192xh192'])

  pitchers = []
  for p in bullpen:
    stats = render_template('mlb-pitcher-stats.html', data=p)
    if ('blurb' in p and p['blurb'] != None):
      evaluation = render_template('evaluation.html', stats=stats, blurb=p['blurb'], gradeImage=p['grade'] if 'grade' in p else None,
        personName=p['player']['first_initial_and_last_name'], personImage=p['player']['headshots']['w192xh192'])
      pitchers.append(evaluation)

  hitters = []
  for p in data['player_records']:
    stats = render_template('mlb-hitter-stats.html', data=p)
    if ('blurb' in p and p['blurb'] != None):
      evaluation = render_template('evaluation.html', stats=stats, blurb=p['blurb'], gradeImage=p['grade'] if 'grade' in p else None,
        personName=p['player']['first_initial_and_last_name'], personImage=p['player']['headshots']['w192xh192'])
      hitters.append(evaluation)

  managerHtml = ''
  if 'managerBlurb' in blurbs:
    manager = data['manager']
    managerHtml = render_template('evaluation.html', stats='', blurb=blurbs['managerBlurb'], gradeImage=grades['managerGrade'] if 'managerGrade' in grades else None,
      personName=manager['name'], personImage=manager['image'])


  freeForm = []
  for x in range(1, 6):
    if 'freeForm' + str(x) in blurbs:
      freeForm.append(blurbs['freeForm' + str(x)])

  html = render_template('mlb-reaction.html', hitters=hitters, pitchers=pitchers, managerHtml=managerHtml,
   battingSummaryHtml=battingSummaryHtml, bullpenSummaryHtml=bullpenSummaryHtml, startingPitcherHtml=startingPitcherHtml,
   freeForm=freeForm, overview=data["overview"],
   unevenInnings=len(data["overview"]['line_scores']['home']) != len(data["overview"]['line_scores']['away']))

  return jsonify({"html": html});





@app.route("/nba/generate-reaction", methods=['POST'])
def generate_nba_reaction():
  payload = json.loads(request.form["data"])
  evaluation = payload['evaluation']
  blurbs = evaluation['blurbs']
  grades = evaluation['grades']
  data = get_aligned_nba_box_score(payload['team_id'])
  nba = NBA()

  data['player_records'] = apply_evaluation(evaluation, data['player_records'])
  players = []
  for p in data['player_records']:
    if 'player' in p:
        stats = render_template('nba-player-stats.html', p=p['player'])
    else:
        stats = render_template('nba-player-stats.html', p=p)
    if ('blurb' in p and p['blurb'] != None):
      evaluation = render_template('nba-evaluation.html', blurb=p['blurb'], stats=stats, gradeImage=p['grade'] if 'grade' in p else None,
        personName=p['player']['first_initial_and_last_name'], personImage=p['player']['headshots']['w192xh192'])
      players.append(evaluation)

  managerHtml = ''
  if 'managerBlurb' in blurbs:
    manager = data['manager']
    managerHtml = render_template('nba-evaluation.html', stats='', blurb=blurbs['managerBlurb'], gradeImage=grades['managerGrade'] if 'managerGrade' in grades else None,
      personName=manager['name'], personImage=manager['image'])


  freeForm = []
  for x in range(0, 5):
    if 'freeForm' + str(x) in blurbs:
      freeForm.append(blurbs['freeForm' + str(x)])
  html = render_template('nba-reaction.html', data=data, players=players, managerHtml=managerHtml, freeForm=freeForm)

  return jsonify({"html": html});

@app.route("/mls/generate-reaction", methods=['POST'])
def generate_mls_reaction():
  payload = json.loads(request.form["data"])
  evaluation = payload['evaluation']
  blurbs = evaluation['blurbs']
  grades = evaluation['grades']

  data = get_aligned_mls_box_score(int(payload['team_id']))
  mls = MLS()

  data['player_records'] = apply_evaluation(evaluation, data['player_records'])
  data['goalie_records'] = apply_evaluation(evaluation, data['goalie_records'])
  for d in data['goalie_records']:
    p = DotMap(d)
    d['stats'] = "{0} MP | {1} ({2}) SA (OG) | {3} GA | {4}/{5} R/Y | {6} FC | {7} FS".format(p.minutes_played, p.shots_against, p.shots_on_goal_against, p.goals_against, p.yellow_cards, p.red_cards, p.fouls_committed, p.fouls_suffered)
  for d in data['player_records']:
    p = DotMap(d)
    d['stats'] = "{0} | {1} MP | {2} G | {3} A | {4} ({5}) S | {6} CK | {7} C | {8}/{9} R/Y | {10} FC | {11} FS".format(p.position, p.minutes_played, p.goals, p.assists, p.shots, p.shots_on_goal, p.corner_kicks, p.crosses, p.yellow_cards, p.red_cards, p.fouls_committed, p.fouls_suffered)

  freeForm = []
  for x in range(0, 5):
    if 'freeForm' + str(x) in blurbs:
      freeForm.append(blurbs['freeForm' + str(x)])

  html = render_template('mls-reaction.html', data=data, freeForm=freeForm)

  return jsonify({"html": html});


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
