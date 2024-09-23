# Solarestimator.com
 Lead Click Funnel calculator website for Solarestimator.com

Basically, this whole website is a click funnel + lead generator for solar roofing installations.

It should be lightweight, modern, high-quality, and should not be overtly complex.

The cost savings should be particularly obvious.

It may be upgraded in the future to have more components beyond solar panel installations.

# Developer Notes:

## Flow:

Enter info -> get estimate -> learn more or find installers, basically allows you to get an idea of the different options (comparator)

## Input:

Note: Input order should be simplified as much as possible!

Enter Info:
    email (verify email)
    phone number (country code + phone)
    name (first + last) : string
    address (verify with Google Maps Address API)
    type of property (categorical)
    do you own or rent at this property (bool) 
    how old is your roof (years)
        -> Later on figure out the roof type, wood, slate, etc.

Components:
 + AddressInput.tsx
    - Verify address input
    - Requires Google Places Autocomplete API
 + EnvironmentalImpact.tsx (shows your environmental impact)

 + Footer.tsx
    - Links to social media (TBD) and copyright
 + Navbar.tsx
    - All of the buttons for any other pages, plus eventual hamburger menu

 + QuoteRequestForm.tsx
    - This is where you enter your email, and other kinds of personal data
 + RoofVisualization.tsx (visual editor for the placement of solar panels) (placeholder)
 + SavingsCalculator.tsx (placeholder)
    - Will do the interactive calculations of the cost estimates based on user defined parameters
 + SolarEstimator.tsx (primary component)

 + LocalInstaller.tsx (missing)
    - Figure out details for local installer button, this will send it through Power (national)
    - Connects user with an installer, that part could be automated to get a message to Jack, and then we have to automate marketplace installer finding
        - Ultimately we need something to bid the price lower for the customer, not sure if we can do that at the present 
        - For now focus on giving customer an understanding of the pros and cons of each path, estimates should show how things work and how it breaks even, how it stays net positive etc.

# TODO Primary:

Visualization:
 - [x] Basic frontend for a Next.js site 
 - [x] About Page, mostly boilerplate for now
 - [ ] Choose and refine a color palette, CSS styling
    - [x] Create a placeholder CSS with fluid animations
    - [ ] Analyze the other sites for their palettes and choose the best motifs for our funnel
 - [ ] Integrate 3D components for solar visualization
    - Figure out what calculation figures should be here.

API Integration:
 - [ ] Integrate Google Places API for address parsing from user input
    - [x] Component for User address input (AddressInput.tsx)
    - [x] Address is identified and is used to call the API (e.g. GET /api/sunroof?address=330%20Brookline%20Ave%2C%20Boston%2C%20MA%2002215%2C%20USA)
 - [ ] Integrate Google Sunroof Solar API, get pricing for an address + other details
    - [ ] Get the API to be queried using an address
        - [ ] Bug Fix: 500 Internal Server Error from querying API
        - [ ] Successfully testing out through their web and documentation, to try to get it to run properly locally and with Oauth
            - [ ] Looks like it needs lat/long instead of address, so we need to geocode it using the Google Geocoding API.
 - [ ] Integrate map viewer for sunroof layer data
 - [ ] Have interactive dashboard for the energy savings + calculator that runs in real-time on the web

Marketing Method:
 - [ ] Research and define marketing method for outreach and clickthrough automation
 - [ ] Identify ways to scale advertising and the accumulation of users from different areas organically
    - [ ] Get a report from Jack on possible strategies
 - [ ] Identify best tools for outreach + email marketing + CRM
    - [ ] Possibly use the multi-agents prototype for this
 - [ ] Automatic reachout
 - [ ] Scrape forums to find people asking questions about Solar, and then give a link to us.
 - [] This tool right now is for residential properties, but in the future it could be for commercial properties.


TODO Secondary:
 - [ ] Integrate a language model that can search the web to analyze any savings you may be able to get (using OpenAI Agents) into the interface, so you can find solar savings with natural language.
    - [x] Prototype of this with the prompt: "You are an agent of solarestimator.com, you will search the web to help the user find out based on their address and location what savings they may be able to get from their city, state, municipality, or federal government in terms of credits or programs that may assist them in financially affording solar. Format your response in JSON based on (UNDEFINED) format."
        - [ ] Need to define JSON format for models' findings, and then integrate savings into estimations.
    - [] Test out web search agents' efficacy at doing this kind of task.
 - [ ] Deployment onto Vercel or AWS Amplify
 - [ ] Add dashboard + CRM
 - [ ] Add integrations for CRM management tools from lead data
 - [ ] Create a database in Supabase for backend management of leads
    - [ ] Define database schema model
 - [ ] Capture test lead data and send to backend

Notes:
 + solar_cost_visualizer.py
    - Check the Python code to check how solar is more efficient and more environmentally friendly, but other things that can help with that process (donut/pie graph)
    - They can select installation, windows, heating, etc. that could give them savings. In the beginning give them some visualizations just for solar. 
    - Look at what you could do for other upgrades at another point in time.

 + Analytics:
    - need to analyze the website and what is working for A/B tests., in order to optimize click through rate funnels, add tools for this later

## Other Sites

List of other sites:
 + solar-estimate
    - Simple site that helps with cost finding for installing solar panels in a home
    - https://www.solar-estimate.org/
        - Step 1: Enter your address (first zip code, then address) and the cost of your most recent electric bill (slider from 50 to 600+)
        - Step 2: Our estimator shows how many solar panels your home needs
        - Step 3: We generate an online cost and savings estimate
        - Step 4: You choose how many solar companies send you an exact price by email or text
+ NREL PVWatts Calculator

## Priority Tasks and Notes 9/17/24

## Visualization of panels placed properly + not buggy, with accurate solver
## Placing a visual dashboard that's beautiful that somebody would look.
## Give the user of the tool through email a PDF that details their energy estimates as well for the response to people's quote requests.
## On the other side, integrate the system we are creating with the Aurora 1, it would be the most advanced API to use for this project.
## Aurora estimates have the most accurate estimates.

## Ultimately it should function powerfully as a lead-gen platform for the solar business. But also,
## There should be an educational aspect to the site with the comparator.
## Remember the idea for the comparator is that there is an ownership model, do you want to won the system, or lease PPA the system. We will show the differences, so we want to show the pros and cons for each. And with the purchase, there is the cash purchase and the financial products. There are a host of financial products, but giving them an idea of what the savings will be with all of these. But the estimation should deal with the cash deal. Let the customer decide if it's going to be cash or the financial instrument. The best way to do it is to just display the prices of all of them, but they are all rooted to the cash price. The cash price should be established first, and then the other prices will be calculated and displayed. At the bottom of the pros and cons there will be a button saying find installer or learn more, maybe both of those buttons. One could be white and the other could be colored.

## For the aesthetic, iterate on it based on different possible aesthetic ideas. When I come across interesting sites compile it into an interesting sites list.

## Jack will send some examples of costs and how they work in this industry. He will send the different pictures of the interfaces.

## But really the design and cross-pollination of these different APIs in a way that doesn't look buggy.
## The Design should be the most important part.
## Also how will it find its way in front of people's eyes.

## API's

These are all at cost, we don't have access to anything except the Sunroof API at the moment, but we can try out other API's later if we can purchase access.

List of API's:
 + Enerflo:
    - Unified Solar Sales API Process with a CRM, use as inspiration, API's might be useful
    - They are a competitor, and have the Enphase Estimator, you can choose solar size, battery size, and check different consumption profiles.
    - It shows net energy savings for different property types.
    - Bill Savings + Self Consumption + Sunny/Cloudy
    - Choose configuration, Solar Only vs. other configs
    - Choose monthly electricity bill + estimated energy consumption
    - Button to reset to default values.
    - Tooltips for bar graphs.
    - Disclaimer that it is just a preliminary estimate of the savings, but the installer will provide more precise details.
    - For your energy rneeds, we recommend X
    - Drag slider for solar panels + total energy
    - Steps:
        - Locating your home
        - Getting a satelite image of your roof
        - Finding roof segments and identifying obstructions
        - Fetching sunlight data and accounting for shading losses
        - Placing solar panels optimally
        - Sometimes not able to place panels on your roof
        - Estimating system size...
    - https://docs.enerflo.io/docs/welcome
 + Aurora Solar
    - Use these API's for fine-grained solar system calculation
    - https://docs.aurorasolar.com/reference/aurora-solar-api
 + Demand IQ
    - Personalized sales and marketing funnels for solar sales conversions, measure + quote instantly
    - https://www.demand-iq.com/
    - https://documenter.getpostman.com/view/9514204/TVKA3JpC#intro
 + Roofle Technologies
    - "AI-powered solar installation roofing quote company"
    - Developer integrations + CRMs + dashboard + other crap
    - https://offers.roofle.com/rqp

