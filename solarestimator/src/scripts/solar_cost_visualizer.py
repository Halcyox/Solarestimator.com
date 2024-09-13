from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objects as go
import numpy as np

# Initialize the Dash app
app = Dash(__name__)

# Constants
BASELINE_ENERGY_USAGE = 12000  # kWh/year baseline
SOLAR_MONTHLY_RATE = 100  # Fixed solar monthly rate ($)
ELECTRICITY_COST_PER_KWH = 0.12  # $/kWh cost of electricity
YEARS = list(range(1, 11))  # 10 years

# Sample Measures for Energy Savings
MEASURES = {
    'M1': {'label': 'Insulation Upgrade', 'savings_per_year': 100},  # kWh/year saved
    'M2': {'label': 'Smart Thermostat', 'savings_per_year': 150},
    'M3': {'label': 'LED Lighting', 'savings_per_year': 50}
}

# Function to calculate cumulative savings based on selected measures
def calculate_savings(selected_measures):
    total_savings_per_year = sum(MEASURES[measure]['savings_per_year'] for measure in selected_measures)
    cumulative_savings_kwh = [total_savings_per_year * year for year in YEARS]
    cumulative_cost_savings = [saving * ELECTRICITY_COST_PER_KWH for saving in cumulative_savings_kwh]
    reduced_energy_use = BASELINE_ENERGY_USAGE - total_savings_per_year
    return reduced_energy_use, total_savings_per_year, cumulative_savings_kwh, cumulative_cost_savings

# Function to calculate utility bills with and without solar
def calculate_utility_costs():
    yearly_bill_without_solar = [BASELINE_ENERGY_USAGE * ELECTRICITY_COST_PER_KWH * year for year in YEARS]
    yearly_bill_with_solar = [800 * year for year in YEARS]  # Assume $800/year fixed with solar
    cumulative_savings = [wb - ws for wb, ws in zip(yearly_bill_without_solar, yearly_bill_with_solar)]
    return yearly_bill_without_solar, yearly_bill_with_solar, cumulative_savings

# Pie chart creation function for energy-saving measures
def create_pie_chart(individual_savings):
    pie_labels = [MEASURES[measure]['label'] for measure in individual_savings]
    pie_values = [MEASURES[measure]['savings_per_year'] for measure in individual_savings]
    
    pie_chart = go.Figure(data=[go.Pie(labels=pie_labels, values=pie_values, hole=0.4)])
    pie_chart.update_layout(title='Proportion of Energy Savings by Measure')
    return pie_chart

# Line chart creation function for cumulative energy and cost savings
def create_line_chart(cumulative_savings_kwh, cumulative_cost_savings):
    line_chart = go.Figure()

    # Energy savings over time
    line_chart.add_trace(go.Scatter(
        x=YEARS, y=cumulative_savings_kwh,
        mode='lines+markers', 
        name='Cumulative Energy Savings (kWh)',
        line=dict(color='green', width=3)
    ))

    # Cost savings over time
    line_chart.add_trace(go.Scatter(
        x=YEARS, y=cumulative_cost_savings,
        mode='lines+markers', 
        name='Cumulative Cost Savings (USD)',
        line=dict(color='blue', width=3)
    ))

    # Baseline energy usage
    line_chart.add_trace(go.Scatter(
        x=YEARS, y=[BASELINE_ENERGY_USAGE * year for year in YEARS],
        mode='lines', 
        name='Baseline Energy Usage (kWh)',
        line=dict(color='lightgray', dash='dash')
    ))

    line_chart.update_layout(
        title='Cumulative Energy and Cost Savings Over Time',
        xaxis_title='Years',
        yaxis_title='Savings',
        plot_bgcolor='rgba(245, 245, 245, 1)',
        hovermode='x'
    )
    
    return line_chart

# Utility bills comparison chart function
def create_utility_chart(yearly_bill_without_solar, yearly_bill_with_solar, cumulative_savings):
    utility_chart = go.Figure()

    # Without solar
    utility_chart.add_trace(go.Scatter(
        x=YEARS, y=yearly_bill_without_solar,
        mode='lines+markers', 
        name='Yearly Bill Without Solar',
        line=dict(color='gray', width=3)
    ))

    # With solar
    utility_chart.add_trace(go.Scatter(
        x=YEARS, y=yearly_bill_with_solar,
        mode='lines+markers', 
        name='Yearly Bill With Solar',
        line=dict(color='blue', width=3)
    ))

    # Fixed solar rate
    utility_chart.add_trace(go.Scatter(
        x=YEARS, y=[SOLAR_MONTHLY_RATE * 12] * len(YEARS),
        mode='lines', 
        name='Fixed Solar Rate ($)',
        line=dict(color='cyan', dash='dash')
    ))

    # Cumulative savings
    utility_chart.add_trace(go.Scatter(
        x=YEARS, y=cumulative_savings,
        mode='lines+markers', 
        name='Cumulative Savings',
        line=dict(color='green', width=3)
    ))

    utility_chart.update_layout(
        title='Utility Bill Comparison: With and Without Solar',
        xaxis_title='Years',
        yaxis_title='Cost (USD)',
        plot_bgcolor='rgba(245, 245, 245, 1)',
        hovermode='x'
    )
    
    return utility_chart

# Define the layout for the app
app.layout = html.Div([
    dcc.Checklist(
        id='measures-checklist',
        options=[{'label': MEASURES[key]['label'], 'value': key} for key in MEASURES],
        value=['M1'],  # Default selected value
        labelStyle={'display': 'inline-block'}
    ),
    dcc.Graph(id='energy-savings-pie'),
    dcc.Graph(id='energy-savings-line'),
    dcc.Graph(id='utility-bills-comparison')
])

# Callback to update graphs based on selected energy-saving measures
@app.callback(
    [Output('energy-savings-pie', 'figure'),
     Output('energy-savings-line', 'figure'),
     Output('utility-bills-comparison', 'figure')],
    [Input('measures-checklist', 'value')]
)
def update_graphs(selected_measures):
    # Calculate savings and utility costs
    _, _, cumulative_savings_kwh, cumulative_cost_savings = calculate_savings(selected_measures)
    yearly_bill_without_solar, yearly_bill_with_solar, cumulative_savings = calculate_utility_costs()

    # Create all the charts
    pie_chart = create_pie_chart(selected_measures)
    line_chart = create_line_chart(cumulative_savings_kwh, cumulative_cost_savings)
    utility_chart = create_utility_chart(yearly_bill_without_solar, yearly_bill_with_solar, cumulative_savings)

    return pie_chart, line_chart, utility_chart

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
