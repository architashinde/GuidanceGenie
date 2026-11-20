# GuidanceGenie

Career guidance for students and early-career switchers. A questionnaire or a chat collects education, subjects, interests, and skills. The server ranks 26 roles across 23 tech and business domains and returns the matches, the skill gaps, and course links.

**Live app:** [https://guidancegenie.vercel.app](https://guidancegenie.vercel.app)

The public site is the catalogue and the points sheet. Gemini is optional and is used only when `GEMINI_API_KEY` is set.

## What a reviewer can try

1. Open the live app and read any field under Catalogue.
2. Finish the questionnaire, or use Chat and answer until it offers a result.
3. On the result page, read the careers, the missing skills, the course links, and the points sheet.
4. Create an account from that page. Sign in later and open the same result under Saved.

A local database also gets a demo account on first connection, if that email is not already stored:

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

| Score | Band |
| --- | --- |
| 70 and above | Strong match |
| 50 to 69 | Plausible |
| Below 50 | Stretch |

A neighbouring field can rank above a field the person named when the skills fit it better. The result page shows the points, the skills already marked, and the first gaps.

If `GEMINI_API_KEY` is set, Gemini may also name a career that is not in the catalogue and attach course links on known public sites. The catalogue sheet is still calculated and shown. With no key, every career comes from the catalogue. That is how the public deployment behaves.

