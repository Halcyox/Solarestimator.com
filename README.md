# Solar Estimator

A Next.js application for estimating solar potential and cost savings based on location.

## Project Structure

The main application is in the `solarestimator` directory.

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
    - [x] Get the API to be queried using an address
        - [x] Bug Fix: 500 Internal Server Error from querying API
        - [x] Successfully testing out through their web and documentation, to try to get it to run properly locally and on web deployment
            - [x] Looks like it needs lat/long instead of address, so we need to geocode it using the Google Geocoding API.
 - [ ] Integrate map viewer for sunroof layer data
 - [x] Have interactive dashboard for the energy savings + calculator that runs in real-time on the web

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

Notes 9/30/24

Add Tooltips for every variable in the calculator.
Add comprehensive pdf.
If the home roof geometry is too complex, at least we can use the solarAPI data with the shading is useful.
In the absence of the shading data, a generalized estimate based off of roof size.
EagleEye is where they get data when none of the public data has what we need for the shade report.
Less than 4% of homes trying to get solar are lacking in data.

Focus on Texas, Florida, California, New York, Connecticut, Massachusetts, New Jersey.

Add personality, a little bit of whimsical, don't assume anyone knows anything.

A lot of the current stuff, the user doesn't know all the overly complex things.

A lot of the sliders can be in the backend. 98% of the users will want a super streamlined, straightforward experience.

Give people the data for my address.

Maybe instead of caret expansion, if someone wants more detail, maybe we could even ask them: how much time do you have?
How detailed do you want to go with this analysis?

Quick N' Easy
solar for nerds (deeper analysis for nerds)

Demand-IQ, you should go through a flow where you place the panels on the roof, preparing your report...
scanning...
you should analyze how they simplify their information and commnicate it well. Lower the amount of words.

roofr.com is the quality of roofing detail and analysis we want.

![alt text](roofr.png)

If we could do commercial properties (agricultural), or ground lots, that could be an extra credit differentiator. The rough estimation of the dimensions by the user could be much easier than roof installations.

Add a chatbot with localized data.

Add Jack's knowledge base of 10,000 urls related to energy concepts.

When you get a lead, we can have a Zapier integration, when an email is sent to this email address, it triggers some action that automatically reaches out to a person. Ultimately it should automate. Not sure how to automate with the Power platform. If someone is in other states, Jack could contact a local installer and send it to them, but we need records of all of this, and we need updates along the way, we don't want the installer to run away with the lead. On the site when it says find installers, when they are in a specific locality, like Texas or Florida. Jack wants access to all the installers, and the CRM was for all of the installers. Unless Jack convinces Power to help Jack integrate and get more leads to their network, that's the only way to get that going. Otherwise it will have to be local installer relationships.

Integrate with Subhub or GoHighLevel

Later on after we scrape the data from the websites with localized data, we don't want to give the user right off the bat, maybe we give the installer which things will apply to them to add value.

One of the associates of Jack, he's a classmate, the dean of his school thought Jack and him should know each other. This guy is a senior engineer at icon that 3d prints homes. He's got crazy connections with SpaceX and Tesla, he is 27 years old. Jack is trying to work with him to develop new solutions to integrate solar into the 3D printed structures. The cost of the house is much smaller, instead of $3-400 a square foot, the costs are much lower with the 3D printed houses, the per square price is $80 a square foot, which is a huge savings.

Minister energy of Gabon's daughter, Jack talked with her, she got in a plane, flew to DC, heard the president of her country was coming to speak, she talked with him, today she presented today, it's community solar with the 
Icon 3D printed low cost housing, Jack helped her assemble it. Jack is trying to be the solar guy for the Icon 3d printed housing.

Durability of the materials are very strong.

Jack knows someone with a motor design that does not use rare earth metals, she wants to use it for drones. Jack has talked with her, and he talked about planting trees with drones. Planting in general. Jack has a business plan for agrovoltaics, you raise the panels above what you are growing. Instead of doing crops, you can do cattle ranches. You can also have a smart dock that the drones are landing on. The drones can not just take care of animals in various ways, but they could also take care of surrounding farmland, and then return back to the dock where it's being charged and maintained, where it's strategically placed and hidden out of view in these racks. There are some really cool things that will come out of that.

# Solar Estimator

A Next.js application for estimating solar potential and cost savings based on location.

## Project Structure

The main application is in the `solarestimator` directory.

## Deployment with AWS Amplify

This project is configured for deployment with AWS Amplify. The `amplify.yml` file at the root of the repository contains the build configuration.

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Log in to the AWS Amplify Console
3. Choose "Host web app"
4. Connect your repository provider and select this repository
5. Configure the build settings:
   - The `amplify.yml` file should be automatically detected
   - Set any required environment variables (e.g., `NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY`)
6. Click "Save and deploy"

### Environment Variables

Make sure to set the following environment variables in the Amplify Console:

- `NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY`: Your Google Solar API key

### Troubleshooting Deployment

If deployment fails:

1. Check the build logs in the Amplify Console
2. Ensure all required environment variables are set
3. Verify that linting and type checking pass locally

## Local Development

```bash
cd solarestimator
npm install
npm run dev
```

## Build Commands

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build for production
npm run build
```