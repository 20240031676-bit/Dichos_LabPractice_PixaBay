# Pixabay Challenge Viewer

A single-page Pixabay API project built with plain HTML, CSS, and JavaScript.

## Features

- Free-text Pixabay search
- Photo/video selector
- Fetch API requests
- Four challenge buttons:
  - Rocket Launch
  - Basketball
  - Forest
  - Road Forest
- Same-page results
- Loading indicator
- Clear error messages
- Responsive dark layout
- Local `config.js` for development
- `config.js` excluded from Git
- `config.sample.js` committed as a safe template
- Netlify build configuration that creates `config.js` from a Netlify environment variable

## Files

```text
index.html
style.css
script.js
config.sample.js
.gitignore
netlify.toml
README.md
```

`config.js` is intentionally not listed because it is local-only and ignored by Git.

## Run locally

1. Copy `config.sample.js`.
2. Rename the copy to `config.js`.
3. Add your Pixabay API key:

```js
export const API_KEY = "YOUR_REAL_PIXABAY_API_KEY";
```

4. Open the project through a local web server. For example, in VS Code use Live Server.
5. Do not open `index.html` directly with `file://`, because the project uses an ES module import.

## Challenge parameters

The four challenge buttons are configured in `script.js` inside the `CHALLENGES` object.

**Before submitting, replace the example challenge parameters with the exact fixed parameters from the previous Pixabay API Practice Lab.**

The assignment specifically requires the four buttons to reuse those previously supplied parameters. Do not guess if your previous lab used different values.

## GitHub

The required repository name is:

```text
FamilyName_LabPractice_PixaBay_Frontend
```

Replace `FamilyName` with your own family name.

Check that the API key is not tracked:

```bash
git status
git check-ignore -v config.js
```

Then commit and push:

```bash
git add .
git commit -m "Build Pixabay frontend lab"
git push origin main
```

Use your GitHub SSH remote, not HTTPS. Check it with:

```bash
git remote -v
```

An SSH remote normally starts with:

```text
git@github.com:
```

## Netlify deployment

This project uses Netlify because the assignment requires a free static host with environment-variable and build-command support.

### 1. Create the Netlify environment variable

In your Netlify project, go to:

**Project configuration → Environment variables**

Create:

```text
Key: PIXABAY_API_KEY
Value: YOUR_REAL_PIXABAY_API_KEY
```

Keep the value out of GitHub.

### 2. Connect the GitHub repository

Connect the repository:

```text
FamilyName_LabPractice_PixaBay_Frontend
```

to Netlify using continuous deployment.

Netlify will automatically build and deploy when you push changes.

### 3. Build command

The included `netlify.toml` contains the build command. During the Netlify build, it creates:

```text
config.js
```

from the `PIXABAY_API_KEY` environment variable.

The generated file is not committed to GitHub because `.gitignore` contains:

```text
config.js
```

### 4. Publish directory

The project publishes from the repository root:

```text
.
```

No framework or npm installation is required.

## API key security tradeoff

`config.js` is kept out of the Git repository and Git history. This is important because it prevents the raw API key from being accidentally committed to GitHub.

However, this does **not** make the key secret on the live site.

The Netlify build writes the API key into `config.js`, and the browser loads that file because the frontend calls Pixabay directly. A visitor can inspect the JavaScript or browser network requests and potentially see the key.

This is a known tradeoff required by this frontend lab. A production application should normally use a server-side backend or serverless function so the API key is never sent to the browser.

## Rotate the Pixabay key after deployment

The assignment requires the API key to be rotated after the site is live.

After confirming that the deployed site works:

1. Go to your Pixabay account.
2. Generate a new API key.
3. Stop using the old key.
4. Update the Netlify `PIXABAY_API_KEY` environment variable with the new key.
5. Trigger a new deploy.
6. Treat the old deployed key as compromised because it was exposed to the browser.

## Final submission

Submit these two links on Canvas:

1. GitHub repository link
2. Live Netlify site link

There is no need to submit the project files separately if the assignment only requests the two links.
