# -*- coding: UTF-8 -*-
"""PyBank Homework Solution."""

# Dependencies
import csv
import os

# Files to load and output (Remember to change these)
file_to_load = os.path.join("Resources", "budget_data.csv")
file_to_output = os.path.join("analysis", "budget_analysis.txt")

# Read the csv and convert it into a list of dictionaries
with open(file_to_load) as financial_data:
    reader = csv.reader(financial_data)

    # Read the header row
    header = next(reader)

    # Extract first row and set initial values
    first_row = next(reader)
    first_net = int(first_row[1])
    total_months = 1  # keep track of number of months
    prev_net = first_net  # keep the previous month's net, to calculate increase/decrease
    total_net = first_net  # keep track of the sum
    net_change_list = []
    greatest_increase = None  # store the greatest increase
    greatest_decrease = None  # store the greatest decrease
    last_net = None  # store the last net

    for row in reader:
        # save row data in variables for future reference and readability
        month = row[0]
        net = int(row[1])

        # Track the total
        total_months += 1
        total_net += net

        # Track the net change
        net_change = net - prev_net
        prev_net = net
        net_change_list.append(net_change)

        # overwrite the value of `last_net` for each row
        # the final value after the for loop will be the value for the last row
        last_net = net

        # Calculate the greatest increase
        if greatest_decrease is None or net_change > greatest_increase[1]:
            greatest_increase = (month, net_change)

        # Calculate the greatest decrease
        if greatest_decrease is None or net_change < greatest_decrease[1]:
            greatest_decrease = (month, net_change)

# Calculate the Average Net Change
avg_net_change = sum(net_change_list) / len(net_change_list)
# Alternative:
# We do not actually need to use a list here
# The average change is, by definition, the total change divided by number of changes
# Uncomment the following line:
# avg_net_change = (last_net - first_net) / (total_months - 1)

# Generate Output Summary
# Use triple quotes to write a multi-line string literal
output = f"""
Financial Analysis
----------------------------
Total Months: {total_months}
Total: ${total_net}
Average  Change: ${avg_net_change:.2f}
Greatest Increase in Profits: {greatest_increase[0]} (${greatest_increase[1]})
Greatest Decrease in Profits: {greatest_decrease[0]} (${greatest_decrease[1]})
"""

# Print the output (to terminal)
print(output)

# Export the results to text file
with open(file_to_output, "w") as txt_file:
    txt_file.write(output)
