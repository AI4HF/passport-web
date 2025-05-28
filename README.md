# AI Product Passport

<div align="center" style="background-color: white">
  <a href="https://www.ai4hf.com/">
    <img height="60px" src="readme-assets/ai4hf_logo.svg" alt="AI4HF Project"/>
  </a>
</div>

<br/>

<p align="center">
  <a href="https://github.com/AI4HF/passport-web">
    <img src="https://img.shields.io/github/license/AI4HF/passport-web" alt="License">
  </a>
  <a href="https://github.com/AI4HF/passport-web/releases">
    <img src="https://img.shields.io/github/v/release/AI4HF/passport-web" alt="Releases">
  </a>
</p>

<br/>

This repository contains the source code and deployment scripts of the frontend of the AI Product Passport developed under the [AI4HF](https://www.ai4hf.com/) project. 

The AI Product Passport is one of the traceability tools for post-deployment AI monitoring. It aims to enhance transparency, traceability, and comprehensive documentation of AI models used within the production environments. Its validation and testing has been carried out for the healthcare sector where different predictive AI models have been deployed into hospital environments. Each deployment of each AI model has its AI Product Passport instance. 

# AI4HF Passport GUI

Simple Setup Guide

- Before attempting any procedures in this list, make sure that the Passport Backend and the Keycloak Realm are all set up and running properly.
- With the authorization and backend in order, open the terminal for this project.
- Go to the Frontend folder with ```cd .\passport-web\``` command, if not already in that folder.
- In the frontend project, use ```npm install``` to install all the packages that are set up to be installed in the configuration files
- Finally, use ```npm start``` to run the application in a specific local port
- After all of this, the application in url http://localhost:4200/ should be set up.

# Requirements
- Node.js 16.14.0 