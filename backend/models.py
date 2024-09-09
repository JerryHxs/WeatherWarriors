#models.py
from time import sleep
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import List, Dict

app = Flask(__name__)
app.app_context().push()

USER ="postgres"
PASSWORD ="pass"
PUBLIC_IP_ADDRESS ="localhost:5432"
DBNAME ="weatherdb"

# the API for geocoding API (OpenCage)
OPENCAGE_API_KEY = 'b25ce10a6c22438c9775296aba0c4e5c'

# Configuration 
app.config['SQLALCHEMY_DATABASE_URI'] = \
os.environ.get("DB_STRING",f'postgresql://{USER}:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # To suppress a warning message
db = SQLAlchemy(app)

current_places = []

# the places the website will have infor for before the user enters new ones
default_places = [{'City': 'Austin', 'State': 'TX', 'lat': '30.27', 'long': '-97.74'}, 
                  {'City': 'San Francisco', 'State': 'CA', 'lat': '37.77', 'long': '22.42'},
                  {'City': 'Seattle', 'State': 'WA', 'lat': "47.61", 'long': "122.33"}]

# The Place model - a location
class Places(db.Model):
    __tablename__ = 'places'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    forecasts = db.relationship('Weather', backref='place', lazy=True)
    alerts = db.relationship('Alerts', backref='place', lazy=True)
    __table_args__ = (db.UniqueConstraint('name', 'state', name='unique_city_state'),)

# The Weather model - the weather at a place on a particular day
class Weather(db.Model):
    __tablename__ = 'weather'

    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    temperature = db.Column(db.Integer, nullable=False)
    precipitation = db.Column(db.Float, nullable=True)
    wind_speed = db.Column(db.String(255), nullable=False)
    wind_direction = db.Column(db.String(255), nullable=False)
    detailed_forecast = db.Column(db.Text, nullable=False)
    __table_args__ = (db.UniqueConstraint('city_id', 'start_time', name='unique_city_start_time'),)
    
# The Alerts model - active weather alerts for a location
class Alerts(db.Model): 
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False)
    event = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)

    __table_args__ = (db.UniqueConstraint('city_id', 'event', name='unique_city_event'),)

# takes a (city, state) and puts its weather report in database (report has 1 week forecast, and alerts) 
# models.py

def create_entries(city_name, state_name):
    data = get_weather_data(city_name, state_name)
    if data == -1:
        print("invalid place")
        return -1

    city_name = data[4]
    state_name = data[5]
    lat = data[0]
    long = data[1]

    # check if given city is already in the list (sidebar)
    if check_for_city(city_name, state_name) == False:
        new_city = {'City': city_name, 'State': state_name, 'lat': lat, "long": long}
        current_places.append(new_city)

    # Check if the city is already in the database
    place = Places.query.filter_by(name=city_name, state=state_name).first()
    if not place:
        place = Places(name=city_name, state=state_name, lat=data[0], lng=data[1])
        db.session.add(place)
        db.session.commit()
    
    city_id = place.id

    # Update or create weather entries
    for period in data[2]['properties']['periods']:
        start_time = datetime.strptime(period['startTime'], '%Y-%m-%dT%H:%M:%S%z')
        end_time = datetime.strptime(period['endTime'], '%Y-%m-%dT%H:%M:%S%z')        
        weather_obj = Weather.query.filter_by(city_id=city_id, start_time=start_time).first()
        
        if not weather_obj:
            weather_obj = Weather(
                city_id=city_id,
                start_time=start_time,
                end_time=end_time,
                temperature=period['temperature'],
                precipitation=period.get('probabilityOfPrecipitation', {}).get('value', 0) or 0,
                wind_speed=period['windSpeed'],
                wind_direction=period['windDirection'],
                detailed_forecast=period['detailedForecast']
            )
            db.session.add(weather_obj)
        else:
            weather_obj.end_time = end_time
            weather_obj.temperature = period['temperature']
            weather_obj.precipitation = period.get('probabilityOfPrecipitation', {}).get('value', 0) or 0
            weather_obj.wind_speed = period['windSpeed']
            weather_obj.wind_direction = period['windDirection']
            weather_obj.detailed_forecast = period['detailedForecast']

    # Update or create alert entries
    for alert in data[3]['features']:
        alert_obj = Alerts.query.filter_by(city_id=city_id, event=alert['properties']['event']).first()
        if not alert_obj:
            alert_obj = Alerts(
                city_id=city_id,
                event=alert['properties']['event'],
                description=alert['properties']['description']
            )
            db.session.add(alert_obj)
        else:
            alert_obj.description = alert['properties']['description']

    db.session.commit()
    return 0  # Return 0 for success
def check_for_city(city_name, state_name):
    # print(city_name)
    # print(state_name)

    if len(current_places) == 0:
        current_places.append({'City' : city_name, 'State' : state_name})

    for one_city in current_places:
        if one_city['City'] == city_name and one_city['State'] == state_name:
            # print("found in list")
            return True
        # print("not in list")
        return False

# gets the weather data from the National Weather Service using coordinates from OpenCage 
def get_weather_data(city_name, state_name):

    # Convert city and state to coordinates
    geocode_url = f'https://api.opencagedata.com/geocode/v1/json?q={city_name},{state_name}&key={OPENCAGE_API_KEY}'
    geocode_response = requests.get(geocode_url)
    geocode_data = geocode_response.json()

    try: # if at any point we cannot get data, we know the place is invalid
        lat = geocode_data['results'][0]['geometry']['lat']
        long = geocode_data['results'][0]['geometry']['lng']

        # Get the weather data from National Weather Service
        weather_url = f'https://api.weather.gov/points/{lat},{long}'
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()

        uniform_city = weather_data['properties']['relativeLocation']['properties']['city']
        uniform_state = weather_data['properties']['relativeLocation']['properties']['state']
        forecast_url = weather_data['properties']['forecast']
        alerts_url = weather_data['properties']['forecastZone']
        alerts_url = alerts_url[39:] #chop string to get zone from url

        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json() #final data

        alerts_response = requests.get(f'https://api.weather.gov/alerts/active?zone={alerts_url}')
        alerts_data = alerts_response.json() #final data
        return (lat, long, forecast_data, alerts_data, uniform_city, uniform_state)
    except:
        return -1
    
# gets the forecast and alerts for the given city and stores them in global variables
def pull_entries(city_name, state_name, wantOneWeek):

    try:
        place = Places.query.filter_by(name=city_name, state=state_name).first() # look up this city's entry
        
        weather = []
        alerts = []
        if wantOneWeek: #if we want a week's worth of data
            weather = Weather.query.filter_by(city_id=place.id).all() # get the weather entries for this city [list of table lines]
            alerts = Alerts.query.filter_by(city_id=place.id).all() # get the current alerts for this city [list of table lines]
        else: # if we want a day's data
            weather = Weather.query.filter_by(city_id=place.id).limit(2).all() # get the weather entries for this city [list of table lines]
            alerts = Alerts.query.filter_by(city_id=place.id).limit(2).all()
        
        return (weather, alerts)
    except:
        print("invalid pull")
        return -1
    
# sets up the database with the default cities
def init_db():
    global current_places
    db.drop_all()
    db.create_all()
    
    # put all default cities into database and current_places
    for place in default_places:
        state = place['State']
        city = place['City']
        create_entries(city, state)
        # current_places.append({'City': city, 'State': state})
        sleep(1)
    # create_entries('abstract', 'octopus') # invlid place for debugging
    # create_entries('fiberglass', 'corndog') # invlid place for debugging
    # create_entries('fireproof', 'procupines') # invlid place for debugging

# if __name__ == '__main__':
#     init_db()
    # create_entries('Daly City', 'CA')
    # print("done with init")
    # data = pull_entries('Austin', 'TX', True)
    # print(data[0][0].temperature)
    # pull_entries('San Francisco', 'CA', False)
    # pull_entries('Seattle', 'WA', False)
    # print(len(current_places))
    # app.run()