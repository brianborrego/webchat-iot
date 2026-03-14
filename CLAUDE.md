# WebChat-IoT: Web Socket Chat Application (w/ Firebase)

**Course:** CIS4930 — Full Stack IoT Development
**GitHub:** https://github.com/brianborrego/webchat-iot.git

---

## Project Overview

A real-time chat application using Socket.io, with TensorFlow.js toxicity filtering and Firebase message persistence. Each part requires a separate Git commit.

---

## Implementation Plan

### Part 1: Base Chat Application (Commit 1)

#### Files to create:
- `index.html` — Chat UI
- `styles.css` — Custom styling
- `chat.js` — Client-side socket logic
- `index.js` — Express + Socket.io server
- `package.json` — Project dependencies

#### Frontend (`index.html` + `styles.css`)
- [x] Can be fully done by Claude
- HTML elements needed:
  - Text input for **username/handle**
  - Text input for **message**
  - **"Send Message" button**
  - **Chat display area** (message list)
  - **"is typing..." indicator**
- Styling with Bootstrap (CDN) + custom CSS in `styles.css`
- Must be visually customized (not default Bootstrap)

#### Backend (`index.js`)
- [x] Can be fully done by Claude
- Import: `express`, `socket.io`, `cors`
- Serve static files (index.html, styles.css, chat.js)
- Set up Socket.io server
- Handle events:
  - `connection` — new user connects
  - `message` — broadcast messages to all clients
  - `typing` — broadcast typing indicator

#### Client Socket Logic (`chat.js`)
- [x] Can be fully done by Claude
- Connect to server via `io()`
- Emit: `message`, `typing`
- Listen: `message` (append to chat), `typing` (show indicator)

#### NPM Setup
- [x] Can be fully done by Claude
- `npm init`
- `npm install express socket.io cors`
- Note: `ngrok` is used via CLI, not as an npm dependency (install globally or use npx)

---

### Part 2: GitHub Setup (Commit 1)

- [x] Already done — repo created at https://github.com/brianborrego/webchat-iot.git
- `.gitignore` for Node — **needs to be added** (was not auto-generated since repo was empty)
- First commit: push Part 1 code

#### Claude can do:
- Create `.gitignore` file
- Stage, commit, and push code

#### You need to do:
- Nothing — repo already exists and is cloned locally

---

### Part 3: TensorFlow.js Toxicity Detector (Commit 2)

- [x] Can be mostly done by Claude

#### Implementation:
- Add TensorFlow.js + Toxicity model via **CDN** in `index.html` (easier than npm):
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity"></script>
  ```
- In `chat.js`, before emitting a message:
  1. Load the toxicity model (cache it after first load)
  2. Run `model.classify(message)`
  3. If any category is flagged as toxic → replace message text with `*****`
  4. Then emit the (possibly censored) message

#### Claude can do:
- Write all the toxicity detection code
- Integrate it into the existing chat flow
- Commit and push

---

### Part 4: Firebase Integration (Commit 3)

#### You need to do (manual steps):
1. Go to https://console.firebase.google.com
2. Create a new Firebase project (any name, e.g., "webchat-iot")
3. Add a **Web app** to the project
4. Copy the Firebase config object (apiKey, authDomain, projectId, etc.)
5. Go to **Firestore Database** → Create database (start in **test mode** for development)
6. Share the Firebase config values with me so I can set up the `.env` file

#### Claude can do (once you provide config):
- Create `.env` file with Firebase keys
- Install `firebase` npm package (or use Firebase Admin SDK)
- Modify `index.js`:
  - Initialize Firebase/Firestore
  - **On Connect:** Query Firestore collection, get 10 most recent messages (ordered by timestamp), emit each to the connecting client
  - **On Message Sent:** Add document to Firestore collection with `{ username, message, timestamp }`
- Add `dotenv` package for environment variable loading
- Ensure `.env` is in `.gitignore`
- Commit and push

#### Firestore Collection Structure:
```
Collection: "messages"
  Document: {
    username: string,
    message: string,
    timestamp: Firestore.Timestamp
  }
```

---

## File Structure (Final)

```
webchat-iot/
├── .gitignore
├── .env              (not committed)
├── package.json
├── index.js          (Express + Socket.io + Firebase server)
├── index.html        (Chat UI)
├── styles.css        (Custom styling)
├── chat.js           (Client-side socket logic)
└── CLAUDE.md         (this file)
```

---

## Commit History Plan

| # | Description | Part |
|---|-------------|------|
| 1 | Base chat application with Socket.io | Parts 1 & 2 |
| 2 | Add TensorFlow.js toxicity detector | Part 3 |
| 3 | Add Firebase message persistence | Part 4 |

---

## Submission Checklist (You must do these)

- [ ] **Video 1 — Chat Demo:** Zoom call with friend on different Wi-Fi, demo messaging + toxicity filter + refresh to show Firebase persistence
- [ ] **Video 2 — Code Walkthrough:** Screen recording explaining Firebase code + GitHub commit history
- [ ] Upload both videos to YouTube as **unlisted**
- [ ] Submit YouTube links

---

## Summary: What Claude Can vs. Can't Do

| Task | Claude? | You? |
|------|---------|------|
| Write all code (HTML, CSS, JS, server) | ✅ | |
| Set up npm / dependencies | ✅ | |
| Create .gitignore | ✅ | |
| Git commits and pushes | ✅ | |
| TensorFlow toxicity integration | ✅ | |
| Firebase code integration | ✅ (after config) | |
| Create Firebase project | | ✅ |
| Provide Firebase config keys | | ✅ |
| Set up ngrok for demo | | ✅ |
| Record demo videos | | ✅ |
| Find a friend for Zoom demo | | ✅ |
| Upload videos & submit | | ✅ |

---

## Next Steps

When you're ready, tell me to start **Part 1** and I'll build out the base chat application. After that we'll commit, then move to Part 3 (toxicity), and finally Part 4 (Firebase — once you've created the project and shared the config).
