from flask import (
    Flask,
    render_template,
    jsonify,
    request)
# Import pymongo library, to connect Flask app to our Mongo database.
import pymongo
import pandas as pd

# Create an instance of Flask app.
app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.jobs_db

# Set route
@app.route('/')
def index():
    # Store the job listings collection in a list
    # Return the template with the jobs list passed in
    return render_template('index_ml.html')

# Set route
@app.route('/jobs')
def jobs():
    """ Return list of jobs"""
    jobs_list = {}
    jobs_data = list(db.job_listings.find())
    df = pd.DataFrame(jobs_data)
    df = df.drop(['_id'], axis=1)
    json_data = df.to_json(orient='records')
    # Return the jobs list (it is already in json format)
    return json_data


@app.route('/table')
def landing():
     return render_template('index_table.html')


@app.route('/map')
def map():
     return render_template('index_map_sicong.html')


@app.route('/charts')
def charts():
     return render_template('index_graphs.html')

@app.route('/piechart')
def pie_chart():
    """ Return list of jobs"""
    jobs_data = list(db.job_listings.find())
    df = pd.DataFrame(jobs_data)
    df = df.drop(['_id'], axis=1)
    df = df.drop_duplicates(keep = 'first')
    df = df.loc[df["City"] != 'United States']
    
    grp_state_df = df.groupby('State')
    jobs_state_df = grp_state_df[["State"]].count()
    jobs_state_df = jobs_state_df.rename(
        columns = {"State": "Jobs_Count"}
        ).sort_values(by='Jobs_Count', ascending=False).reset_index()
    json_states_jobs = jobs_state_df.to_json(orient='records')
    # Return the jobs list (in json format)
    return json_states_jobs

# Set route for number of jobs by City in the State chosen
@app.route("/donutchart/<State>")
def donut_chart(State):
    """ Return list of jobs"""
    jobs_data = list(db.job_listings.find())
    df = pd.DataFrame(jobs_data)
    df = df.drop(['_id'], axis=1)
    df = df.drop_duplicates(keep = 'first')
    if (State !='All'):
        df = df.loc[df["State"] == State]

    grp_city_df = df.groupby('City')
    jobs_city_df = grp_city_df[["City"]].count()
    jobs_city_df = jobs_city_df.rename(
        columns = {"City": "Jobs_Count"}
        ).sort_values(by='Jobs_Count', ascending=False).reset_index()
    json_cities_jobs = jobs_city_df.to_json(orient='records')

    return json_cities_jobs

# Set route for number of jobs by Company
@app.route('/company/<choice>')
def company(choice):
    """ Return list of jobs"""
    jobs_data = list(db.job_listings.find())
    df = pd.DataFrame(jobs_data)
    df = df.drop(['_id'], axis=1)
    df = df.drop_duplicates(keep = 'first')   

    grp_company_df = df.groupby('Company')

    if (choice == "Jobs"):
        field = "Jobs_Count"
        jobs_company_df = grp_company_df[["Company"]].count()
        jobs_company_df = jobs_company_df.rename(columns = {"Company": "Value"}).sort_values(by='Value', ascending=False).reset_index()

    else:
        field = "Avg Salary" 
        jobs_company_df = grp_company_df[['Avg Salary']].mean()
        jobs_company_df = jobs_company_df.rename(columns = {"Avg Salary": "Value"}).sort_values(by= 'Value', ascending=False).reset_index()


    json_company_jobs = jobs_company_df.to_json(orient='records')
    # Return the jobs list (in json format)
    return json_company_jobs
if __name__ == "__main__":
    app.run(debug=True)
