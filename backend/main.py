#!/usr/bin/env python3
# main.py

from flask import Flask, jsonify, request
from flask_cors import CORS
from models import app, db, init_db, create_entries, pull_entries, Places, current_places

CORS(app)

@app.route('/api/weather/<city_name>/<state_name>', methods=['GET'])
def get_weather(city_name, state_name):
    one_week = request.args.get('oneWeek', 'true').lower() == 'true'
    data = pull_entries(city_name, state_name, one_week)
    if data != -1:
        weather_data = [
            {
                'start_time': w.start_time.isoformat(),
                'end_time': w.end_time.isoformat(),
                'temperature': w.temperature,
                'precipitation': f"{w.precipitation or 0}%",
                'wind_speed': w.wind_speed,
                'wind_direction': w.wind_direction,
                'detailed_forecast': w.detailed_forecast
            } for w in data[0]
        ]
        alerts_data = [
            {
                'event': a.event,
                'description': a.description
            } for a in data[1]
        ]
        # render_template('index.html', weather = weather_data, alert = alert_data)
        return jsonify({'weather': weather_data, 'alerts': alerts_data})
    return jsonify({'error': 'Invalid city or state'}), 400

@app.route('/api/cities', methods=['POST'])
def add_city():
    data = request.json
    city_name = data.get('city')
    state_name = data.get('state')
    if not city_name or not state_name:
        return jsonify({'error': 'City and state are required'}), 400
    
    result = create_entries(city_name, state_name)
    if result == -1:
        return jsonify({'error': 'Failed to add city'}), 400
    
    # Update current_places list
    # current_places.append({'City': city_name, 'State': state_name})
    # render_template('city.html', city = current_places[len(current_places)-1])
    return jsonify({'success': True, 'message': 'City added successfully'})

@app.route('/api/cities', methods=['GET'])
def get_cities():
    # cities = Places.query.all()
    # render_template('cities_all.html')
    return jsonify([{'name': city['City'], 'state': city['State']} for city in current_places])

if __name__ == '__main__':
    init_db()
    app.debug = True
    app.run(host='0.0.0.0', port=5000)