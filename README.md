# GuidanceGenie 🎓

GuidanceGenie is a career guidance web app that recommends suitable career paths and job roles based on a student’s interests, skills, and preferences.

Tech stack: **HTML, CSS, JavaScript, Node.js, MongoDB**

## Features

- **Automated career recommendations**  
  Rule-based engine that matches user interests, skills, and preferences to relevant career paths and roles.

- **Interactive questionnaires**  
  Guided questionnaire flow to capture strengths, interests, and work-style preferences.

- **Rich results page**  
  Result cards showing matching roles, key skills, suggested learning resources, and basic career information.

- **User accounts & history**  
  Students can sign up with email so their profiles and top recommendations are stored in MongoDB and revisited later as history.
## Project Structure

- `frontend/` – Landing page, questionnaire UI, and results view (HTML, CSS, JavaScript)
- `backend/`
  - `server.js` – Express server, MongoDB connection, API wiring
  - `routes/career.js` – Endpoints for submitting questionnaires and fetching recommendations
  - `models/user.js` – User profile + saved recommendations schema
  - `data/careers.js` – Rule-based career knowledge base (skills, weights, resources)
## Getting Started

### Prerequisites

- Node.js (LTS)
- npm or yarn
- MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repository

### 2. Install dependencies


### 3. Configure environment variables

Create a `.env` file in the project root:


### 4. Run the app


The app will be available at `http://localhost:5000`.
## Usage

1. Open `http://localhost:5000` in the browser.
2. Enter:
   - Email
   - Skills (comma separated)
   - Interests (comma separated)
3. Click **Start Assessment** to view recommended careers.
4. The backend:
   - Scores each career in the knowledge base against your skills & interests.
   - Returns the top matches with descriptions, required skills, salary/education info, and learning links.
   - Saves the profile + top matches in MongoDB for future history/analytics.
## Future Improvements

- Add separate detail pages and roadmaps for each career
- Enhance rule engine with more weights (e.g., work-style, industry preferences)
- Admin panel to manage career data
- Optional ML-based ranking model on top of the current rule-based core

## Screenshots

###  Home Page
![Home Page](https://raw.githubusercontent.com/architashinde/GuidanceGenie/main/home.png)

###  Recommendations Page
![Recommendations](https://raw.githubusercontent.com/architashinde/GuidanceGenie/main/recommendations.png)
