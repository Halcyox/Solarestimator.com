import React from 'react';

const IntroSection = () => (
  <div>
    <h1 className="text-4xl font-bold text-center mb-6">Unlock Your Solar Savings Potential with Science-Backed Precision</h1>
    <p className="text-lg text-center mb-4">
      Imagine reducing your electric bill by up to 75%, significantly cutting your carbon footprint, and achieving energy independence. At SolarEstimator.com, we make this vision a reality through detailed, data-driven solar conversion strategies. Backed by decades of research from the Department of Energy's (DOE) Solar Energy Technologies Office (SETO) and groundbreaking findings from the National Renewable Energy Laboratory (NREL), our platform ensures you get the most accurate and efficient solar solutions available. 
      We further enhance our analysis by integrating the Google Sunroof API, which utilizes satellite imagery to calculate sun exposure, roof angles, and shading, offering unparalleled precision in solar estimates. 
      Leveraging insights from the 2021 Solar Futures Study, which predicts that solar energy could meet 40% of U.S. electricity demand by 2035, we ensure your solar journey is optimized for maximum savings.
      <a href="https://www.energy.gov/sites/default/files/2021-09/Solar_Futures_Study_Fact_Sheet.pdf" target="_blank" className="text-blue-500 underline">Learn more about our scientific foundations</a>.
    </p>
  </div>
);

const ProcessOverview = () => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-4">A Scientifically Proven Solar Estimation Process</h2>
    <p className="text-lg text-center mb-4">
      Transitioning to solar is a complex decision, and our process is designed to ensure that every step is based on proven scientific methods. Utilizing methodologies derived from extensive research on solar energy's cost-effectiveness and long-term benefits, our approach is meticulously crafted to help homeowners optimize their solar investment. 
      In addition to our proprietary AI algorithms and data models, we incorporate Google Sunroof's advanced API to provide accurate estimates by analyzing your roof's solar exposure, factoring in local sun patterns, seasonal variations, and potential shading from nearby objects. 
      Studies from the International Energy Agency (IEA) suggest that global solar photovoltaic (PV) installations are expected to expand by 18% annually through 2030. Our platform integrates this growth data into every estimate, ensuring you're prepared for the future.
      <a href="https://www.nrel.gov/analysis/solar-futures.html" target="_blank" className="text-blue-500 underline">Read about our rigorous methodology</a>.
    </p>
  </div>
);

const StepsDetail = () => (
  <div>
    <ol className="list-decimal list-inside text-lg mb-4">
      <li><strong>Gather Your Data:</strong> Provide your address and key property details. Our system then analyzes your location using geospatial data from the National Solar Radiation Database (NSRDB) and Google Sunroof's API, which leverages satellite imagery and machine learning to evaluate your roof's solar energy potential, considering sun exposure and roof slope.</li>
      <li><strong>Advanced Analysis:</strong> We integrate real-time environmental data, including local weather patterns and energy prices, into proprietary AI algorithms. Google Sunroof's API adds another level of accuracy by calculating how much sunlight your roof receives annually, factoring in obstructions like trees and buildings. Our models are continuously refined using data from NREL's PVWatts Calculator and actual solar installations across the country.</li>
      <li><strong>Explore Your Options:</strong> Based on the analysis, you will receive a detailed report outlining potential savings, energy generation capacity, and environmental impact. A typical 5 kW solar system, according to Google Sunroof's estimates, can generate around 8,000 kWh per year, which could result in lifetime savings between $30,000 and $100,000, depending on your location and available tax incentives.</li>
      <li><strong>Connect With Installers:</strong> We connect you with certified local solar installers vetted through the North American Board of Certified Energy Practitioners (NABCEP). According to a report by the Solar Energy Industries Association (SEIA), NABCEP-certified installers increase system longevity and performance, ensuring you maximize returns on your solar investment.</li>
    </ol>
    <p className="text-lg text-center">
      Our platform ensures the most precise solar conversion estimates possible, leveraging the latest in AI, Google Sunroof API data, and energy efficiency research. Studies from <i>Nature</i> affirm the environmental and economic viability of large-scale solar adoption.
      <a href="https://www.nature.com/articles/d41586-021-00090-3" target="_blank" className="text-blue-500 underline">Discover more about our analytical approach</a>.
    </p>
  </div>
);

const MissionStatement = () => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-4">Our Mission: A Sustainable, Solar-Powered Future</h2>
    <p className="text-lg text-center">
      At SolarEstimator.com, we are committed to advancing global sustainability through solar energy. By empowering homeowners to make informed decisions rooted in science, we enable individuals to reduce their reliance on non-renewable energy sources while also achieving substantial economic benefits. The Intergovernmental Panel on Climate Change (IPCC) reports that switching to renewable energy can reduce carbon emissions by over 60%, a critical factor in combating climate change. 
      By incorporating Google Sunroof's satellite-driven insights and NREL's decades of research, we ensure that your path to solar is both scientifically grounded and economically sound. 
      Our commitment is not just to individual savings, but to the collective goal of accelerating the transition to a renewable energy economy.
      <a href="https://www.nature.com/articles/d41586-021-00090-3" target="_blank" className="text-blue-500 underline">Learn about our dedication to sustainability</a>.
    </p>
  </div>
);

const About = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <IntroSection />
      <ProcessOverview />
      <StepsDetail />
      <MissionStatement />
    </div>
  );
};

export default About;
