#%%
import pandas as pd
import numpy as np
import sqlalchemy
import datetime as dt

from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from sqlalchemy.orm import Session

engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

app = Flask(__name__)

@app.route("/")
def welcome():

    return (
        f"Here are the list of available routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations</br>"
        f"/api/v1.0/tobs</br>"
        f"/api/v1.0/start</br>"
        f"/api/v1.0/start/end"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():

    yearago = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    prcpvalue= session.query(Measurement.date, Measurement.prcp).filter(Measurement.date >= yearago).all()
    return jsonify(prcpvalue)

@app.route("/api/v1.0/stations")
def stations():
    stations = session.query(Station.station).all()
    return jsonify(stations)

@app.route("/api/v1.0/tobs")
def tobs():
    yearago = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    temps = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date > yearago).order_by(Measurement.date).all()
    return jsonify(temps)

if __name__ == '__main__':
    app.run()
