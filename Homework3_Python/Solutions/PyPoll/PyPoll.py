# -*- coding: UTF-8 -*-
"""PyPoll Homework Solution."""

# Incorporated the csv module
import csv
import os

# Files to load and output (Remember to change these)
file_to_load = os.path.join("Resources", "election_data.csv")
file_to_output = os.path.join("analysis", "election_analysis.txt")

# Total Vote Counter
total_votes = 0

# Candidate Options and Vote Counters
candidate_votes = {}

# Read the csv and convert it into a list of dictionaries
with open(file_to_load) as election_data:
    reader = csv.reader(election_data)

    # Read the header
    header = next(reader)

    # For each row...
    for row in reader:
        # Add to the total vote count
        total_votes += 1

        # Extract the candidate name from each row
        candidate_name = row[2]

        # If the candidate does not match any existing candidate...
        # (In a way, our loop is "discovering" candidates as it goes)
        if candidate_name not in candidate_votes:
            # And begin tracking that candidate's voter count
            candidate_votes[candidate_name] = 0

        # Then add a vote to that candidate's count
        candidate_votes[candidate_name] += 1

# Print the results and export the data to our text file
with open(file_to_output, "w") as txt_file:

    # Print the final vote count (to terminal)
    election_results = f"""

Election Results
-------------------------
Total Votes: {total_votes}
-------------------------
"""
    print(election_results, end="")

    # Save the final vote count to the text file
    txt_file.write(election_results)

    # Winning Candidate and Winning Count Tracker
    winning_candidate = None

    # Determine the winner by looping through the counts
    for candidate in candidate_votes:

        # Retrieve vote count and percentage
        votes = candidate_votes.get(candidate)
        vote_percentage = float(votes) / float(total_votes) * 100

        # Determine winning vote count and candidate
        if winning_candidate is None or winning_candidate[1] < votes:
            winning_candidate = (candidate, votes)

        # Print each candidate's voter count and percentage (to terminal)
        voter_output = f"{candidate}: {vote_percentage:.3f}% ({votes})"
        print(voter_output)

        # Save each candidate's voter count and percentage to text file
        txt_file.write(voter_output + '\n')

    # Print the winning candidate (to terminal)
    winning_candidate_summary = f"""-------------------------
Winner: {winning_candidate[0]}
-------------------------
"""
    print(winning_candidate_summary)

    # Save the winning candidate's name to the text file
    txt_file.write(winning_candidate_summary)
