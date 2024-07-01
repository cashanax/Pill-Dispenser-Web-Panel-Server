# Pill Dispenser Web Panel Server

This repository contains the backend server for the Pill Dispenser Web Panel, built using Node.js and Express. The server handles API requests, no databse integration, because json is enough for prototype requirements.
Full project documentaiton is available under this link: https://www.eps2024-wiki2.dee.isep.ipp.pt/doku.php?id=report

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)


## Features

- User authentication and management
- CRUD operations for pill schedules
- Integration with pill dispenser hardware (ESP32)
- RESTful API design

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v12.x or later)
- npm (v6.x or later)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/cashanax/Pill-Dispenser-Web-Panel-Server.git
    cd Pill-Dispenser-Web-Panel-Server
    ```

2. **Install dependencies:**

    ```bash
    npm install
    npm install express

    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret
    ```

### Running the Server

To start the server, run:

```bash
node app.js
```

The server will start on the port specified in the .env file (default is 3000). You can access it at http://localhost:3000.
