# GuidanceGenie

Career guidance for students and early-career switchers. A questionnaire or a chat collects education, subjects, interests, and skills. The server ranks 26 roles across 23 tech and business domains and returns the matches, the skill gaps, and course links.

**Live app:** [https://guidancegenie.vercel.app](https://guidancegenie.vercel.app)

The public site is the catalogue and the points sheet. Gemini is optional and is used only when `GEMINI_API_KEY` is set.

## What a reviewer can try

1. Open the live app and read any field under Catalogue.
2. Finish the questionnaire, or use Chat and answer until it offers a result.
3. On the result page, read the careers, the missing skills, the course links, and the points sheet.
4. Create an account from that page. Sign in later and open the same result under Saved.

The first connection creates a demo account if that email is not already stored:

- Email: `meera.kulkarni@example.com`
- Password: `campus-2026`

## Features

- Catalogue of 23 domains (12 tech, 11 business) and 26 roles, each with skills and course links.
- Seven-step questionnaire: education, stream, subjects, interests, skills, aim, and review. Lists and typed answers are both accepted.
- Chat that keeps asking until education, stream, subjects, interests, skills, and aim are known. Someone already working is also asked for a current role and years.
- Result page with suggested careers, skills the role uses, free course links, and the points sheet beside them.
- Accounts with hashed passwords. A result can be saved and opened again. A guest result made in the same browser is attached at register or login.
- Deployed on Vercel, with accounts, sessions, and assessments in MongoDB Atlas.

## Tech stack

| Layer | Choice |
| --- | --- |
| Server | Node.js, Express |
| Language | JavaScript |
| Database | MongoDB, via Mongoose |
| Sessions | express-session, stored with connect-mongo |
| Passwords | bcrypt |
| Pages | Server-rendered HTML in `backend/pages.js` |
| Client | Plain JavaScript for the questionnaire, the chat, and the header |
| Optional model | Gemini REST API, only if `GEMINI_API_KEY` is set |
| Deploy | Vercel |

## Recommendation logic

Ranking is a written scoring sheet in `backend/engine.js`, not a trained model. The same rules are on the How it ranks page.

The questionnaire and the chat collect a profile. `backend/recommend.js` maps that profile onto the sheet: interests, subjects, and stream choose up to three domains, education chooses the stage, and interests choose the kind of workday. Each role then receives points.

| Piece | Points | How it is earned |
| --- | --- | --- |
| Domain | 40 | Full marks for the role's own field. 18 for a neighbouring field. |
| Skills | 30 | Share of that role's skill list the person already marked. A core skill counts more. |
| Workday | 10 | The inferred centre of the day matches the role. |
| Setting | 6 | Small team, large organisation, independent, or client-facing. |
| Pace | 6 | Full marks on a match. A mixed pace scores 3 against a sharper role. |
| Stage | 5 | Full marks when the role is a reasonable next step. Otherwise 1. |
| Education | 3 | The degree or diploma is a usual door into the role. |

Domain points do not stack, so the raw maximum is 100. The score shown is that total scaled to 100.

The questionnaire does not ask for setting or pace. Every profile is scored as a small team at a mixed pace, so those two rows stay small. Domain, skills, workday, stage, and education are the rows that change from person to person.

| Score | Band |
| --- | --- |
| 70 and above | Strong match |
| 50 to 69 | Plausible |
| Below 50 | Stretch |

A neighbouring field can rank above a field the person named when the skills fit it better. The result page shows the points, the skills already marked, and the first gaps.

If `GEMINI_API_KEY` is set, Gemini may also name a career that is not in the catalogue and attach course links on known public sites. The catalogue sheet is still calculated and shown. With no key, every career comes from the catalogue. That is how the public deployment behaves.

## Project structure

```
api/index.js            Vercel entry. Loads the Express app.
index.js                Other serverless entry. Loads the same app.
vercel.json             Sends every route to the Express app.
backend/server.js       Routes, sessions, MongoDB connection.
backend/engine.js       The scoring sheet.
backend/recommend.js    Maps a profile to the sheet. Optional Gemini call.
backend/agent.js        Chat questions and when the chat is ready to rank.
backend/catalog.js      Domains, roles, skills, and course links.
backend/labels.js       Education, streams, subjects, interests, and aims.
backend/db.js           Users and assessments.
backend/pages.js        HTML for every page.
backend/present.js      Turns a saved row into the result page.
public/css/site.css     Layout.
public/js/assess.js     Questionnaire steps and submit.
public/js/chat.js       Chat submit.
public/js/site.js       Back button and form confirms.
test/engine.test.js     Scoring examples and account checks.
```

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Home |
| GET | `/domains`, `/domains/:id` | Catalogue |
| GET | `/roles/:id` | One role, its skills, and its courses |
| GET | `/how` | The points sheet and a worked example |
| GET | `/assess` | Questionnaire |
| POST | `/api/assessments` | Validate the profile, rank it, save it |
| GET | `/chat` | Chat |
| POST | `/api/chat` | One chat turn. Saves a result when the profile is complete |
| POST | `/chat/reset` | Start the chat again |
| GET | `/results/:id` | One saved result |
| GET, POST | `/register`, `/login` | Create an account or sign in |
| POST | `/logout` | Sign out |
| GET | `/saved` | Results for the signed-in account |
| POST | `/saved/:id/delete` | Delete one result |
| GET | `/health` | `{ ok, domains, roles }` |

`POST /api/assessments` accepts JSON: `education`, `stream`, `subjects`, `interests`, `skills`, `aim`, plus optional typed fields and a note. A successful save returns `{ id }`, and the browser opens `/results/:id`.

## Run it locally

### 1. Install Node.js 18 or newer

[https://nodejs.org](https://nodejs.org)

```bash
node -v
npm -v
```

### 2. MongoDB

The deployed app uses MongoDB Atlas. A local run can use that same Atlas database, or [MongoDB Community](https://www.mongodb.com/try/download/community) on this machine.

If `MONGO_URI` is not set, the app uses:

```
mongodb://127.0.0.1:27017/guidancegenie
```

### 3. Install dependencies

From the folder that contains `package.json`:

```bash
npm install
```

| Package | Role |
| --- | --- |
| express | HTTP server and routes |
| mongoose | Users and assessments |
| connect-mongo | Session store |
| express-session | Signed session cookie |
| bcryptjs | Password hashes |
| dotenv | Reads `.env` from the project root |
| nodemon | Dev only. Restarts on file changes |

### 4. Environment variables

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Local port. Default `4721`. |
| `MONGO_URI` | For Atlas | MongoDB connection string. |
| `SESSION_SECRET` | Before anyone else can reach the server | Signs the session cookie. |
| `GEMINI_API_KEY` | No | Empty means catalogue-only results. |
| `GEMINI_MODEL` | No | Used only with a key. Default `gemini-3.5-flash`. |

The server reads `.env` from the project root. That file is gitignored. Do not commit an Atlas password or an API key. If the password contains `@`, `#`, or `/`, percent-encode those characters in `MONGO_URI`.

### 5. Start

```bash
npm start
```

Open [http://127.0.0.1:4721](http://127.0.0.1:4721). While editing, `npm run dev` restarts the server on save.

### 6. Test

MongoDB has to be reachable.

```bash
npm test
```

The checks cover the catalogue size, two worked scoring examples, the current questionnaire profile, and account create, save, and delete. Account checks use `mongodb://127.0.0.1:27017/guidancegenie_test`, or `GG_TEST_MONGO_URI` if that is set, and they wipe that test database only.

## Data stored

| Collection | Contents |
| --- | --- |
| `users` | Name, email, bcrypt password hash, created time |
| `assessments` | Answers, ranked results, top role, optional chat transcript |
| `sessions` | Login sessions. Cookie name `gg.sid`, httpOnly, SameSite `lax`, 14 days |

On Vercel the cookie is `secure`. There is no password-reset email. A result link works for the browser that created it until an account claims it. After that, only that account can open it.

## Deployment

The live app is Express on Vercel.

- `index.js` and `api/index.js` export the Express app.
- `vercel.json` rewrites every path to that app.
- Root directory is `./`. Leave the Build Command, Output Directory, and Install Command overrides off.
- Production environment variables are `MONGO_URI` and `SESSION_SECRET`.
- Atlas Network Access allows `0.0.0.0/0`, because Vercel addresses change.

`GET /health` returns:

```json
{"ok":true,"domains":23,"roles":26}
```

## What this project does not do

- It does not train a model. Machine learning is one career field in the catalogue.
- It does not call Gemini unless `GEMINI_API_KEY` is set.
- It does not send email, take payments, or submit job applications.
- Salary lines are indicative ranges for India. They are not offers.

## Author

Archita Shinde · [github.com/architashinde](https://github.com/architashinde)
