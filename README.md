# GuidanceGenie

GuidanceGenie is a career guidance app for students and early-career switchers. You answer a short questionnaire. The server scores every role in a fixed catalogue and shows the matches, the skills you already have, the skills you do not, and places to learn them. Create an account and the answers and scores stay there, so you can open them again later.

There is no machine learning in this project. Personalisation is a scoring sheet in `backend/engine.js`. The rules are written out on the Scoring page in the app.

The catalogue covers 23 tech and business fields and 26 roles: software, web, mobile, data, security, cloud, DevOps, QA, design, machine learning as a *job*, IT support, product, analysis, marketing, finance, HR, consulting, sales, operations, entrepreneurship, content, and project coordination.

## What you need installed, and when

Do these in order. Do not skip ahead.

### 1. Install Node.js 22 on your computer

This happens once, outside the project folder.

This app stores accounts in SQLite using Node's built-in `node:sqlite` module. That module exists in Node.js 22.5 and newer. Node 18 and Node 20 will not start the server.

Install Node.js 22 LTS from [https://nodejs.org](https://nodejs.org). The installer includes npm.

Check it in a terminal:

```bash
node -v
npm -v
```

You want `v22.x`. Anything starting with `v18` or `v20` is too old for this repo.

### 2. Install this project's libraries

This happens inside the project folder, the one that contains `package.json`. Do it after Node is installed, and before the first run.

```bash
cd /path/to/GuidanceGenie
npm install
```

`npm install` reads `package.json` and creates `node_modules` here. It installs:

| Package | Why it is here |
| --- | --- |
| express | HTTP server and the routes |
| ejs | HTML templates in `views/` |
| bcryptjs | Password hashing for accounts |
| express-session | Signed cookie that keeps you signed in |
| dotenv | Reads a `.env` file if you create one |
| nodemon | Dev only. Restarts the server when you edit files |

Run `npm install` again only if `package.json` changes. You do not run it before every start.

If you do not want the dev tool, use `npm install --omit=dev`. Then `npm start` still works. `npm run dev` will not.

### 3. Optional: a `.env` file

Skip this on your own laptop. The app runs without it.

Create it only if you want a different port, or you are about to let other people reach the server. From the project root:

```bash
cp .env.example .env
```

Edit `.env` and set `SESSION_SECRET` to a long random string. The file stays on your machine. It is listed in `.gitignore`.

### 4. Start the app

From the project root, after `npm install`:

```bash
npm start
```

Open [http://127.0.0.1:4721](http://127.0.0.1:4721).

While you are changing code, use this instead:

```bash
npm run dev
```

That uses nodemon, which was installed in step 2. It is not required to use the app.

### 5. Run the checks

From the project root, after `npm install`:

```bash
npm test
```

This checks the scoring sheet and the demo account seed. It does not need the server to be running.

## Using it

1. Read a field under Catalogue, or start the questionnaire.
2. The questionnaire is six steps: where you are, up to three fields, the shape of a workday, skills you can already use, what you want from the next two years, then a review.
3. Submit. The result page is the ranked roles, the points, the skill gaps, and learning links.
4. Create an account from that page if you want to keep it. Signing in on the same browser attaches the result you just made.
5. Saved assessments are listed under Saved. Open one to see the original answers and scores. Delete removes that row only.

A fresh database includes a demo account so the saved list is not empty:

- Email: `meera.kulkarni@example.com`
- Password: `campus-2026`

There is no password-reset email. If you forget a password on your own machine, stop the server and delete `data/guidancegenie.db`. The next start creates a new file and the demo account again. That also deletes every real account and saved assessment.

## Where the code lives

```
backend/server.js       routes, sign-in, static files
backend/engine.js       the scoring sheet
backend/catalog.js      domains, skills, roles, learning links
backend/labels.js       questionnaire wording
backend/db.js           SQLite schema, accounts, saved assessments
backend/present.js      turns a saved row into the result page
views/                  HTML templates
public/css/site.css     layout
public/js/assess.js     questionnaire steps
data/guidancegenie.db   created on first start, not committed
```

Edit `backend/catalog.js` to add a role. Keep `domainId` and skill ids valid. Restart the server. Assessments already saved are not rewritten.

## Accounts

Passwords are stored as bcrypt hashes. The session cookie is `httpOnly`. Guest results are visible to anyone with the link until an account claims them. After that, only that account can open the link.

The earlier sketch of this project expected a MongoDB Atlas password before the server would do anything useful. This version uses a SQLite file instead, so save-and-revisit works on a laptop with no cloud database. You do not install MongoDB.

## What this does not do

- It does not train or call a model. Machine learning is a career field in the catalogue, not a technique used by the app.
- It does not send email, take payments, or submit job applications.
- Salary lines are indicative ranges for India. They are not offers.