# Personal Finance

Modern personal finance manager built with React, HTML, CSS, and JavaScript.

## Overview

Personal Finance is a clean money-tracking dashboard for managing everyday spending, synced transactions, subscriptions, savings goals, and budget progress. The app is designed around quick visibility: connect a UPI app or bank account, review imported transactions, understand spending trends, and track goals from one place.

## Features

- Connected money dashboard
- UPI and bank sync simulation
- Transaction history with search
- Expense analytics with weekly, monthly, and yearly views
- Subscription detector
- Savings goals
- Monthly spending limit
- AI-style money advice
- Collapsible sidebar navigation
- Responsive layout for desktop and mobile

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React icons

## Getting Started

### Prerequisites

Install Node.js and npm on your system.

### Installation

Clone the repository:

```bash
git clone https://github.com/Rishabh-Mirchandani/Personal_Finance.git
```

Go into the project folder:

```bash
cd Personal_Finance
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
Personal_Finance/
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Pages

### Dashboard

The dashboard focuses on connected finance tracking. It highlights UPI and bank sync actions, balance overview, summary cards, analytics, AI-style advice, and recent transactions.

### Analytics

The analytics page shows spending trends with weekly, monthly, and yearly views. Each view uses sensible sample data, visible graph values, category totals, and summary stats.

### Transactions

The transactions page contains the full transaction history, search, sync actions, manual fallback entry, and subscription detector.

### Goals

The goals page includes the monthly spending limit, budget progress, remaining budget, and savings goals.

## Important Note

The UPI and bank sync features are simulated for demonstration purposes. A real production app would require secure, consent-based integrations with banking APIs or financial data providers.

## License

This project is open for learning and personal use.
