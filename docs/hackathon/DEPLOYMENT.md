# EduMemory Deployment Guide

EduMemory can be deployed as a static site. The app uses `index.html`, plain JavaScript, CSS, and browser `localStorage`. There is no build step required.

## Recommended Option

Use GitHub Pages if the repository will be public and the judges only need a stable demo URL. It is the simplest match for this static app.

## GitHub Pages Option

1. Push the repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings** -> **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch: `sui-overflow-edumemory`.
6. Select the folder: `/root`.
7. Save.
8. Wait for the Pages deployment to finish.

Demo URL format:

`https://YOUR-USERNAME.github.io/YOUR-REPO/?role=edumemory`

Notes:

- No build command is needed.
- The app should be served from the repository root.
- If the repository name is long, create a short custom link for the video description.

## Netlify Option

1. Create a new Netlify site from the GitHub repository.
2. Select branch: `sui-overflow-edumemory`.
3. Leave **Build command** blank.
4. Set **Publish directory** to `.`
5. Deploy.

Demo URL format:

`https://YOUR-SITE.netlify.app/?role=edumemory`

Notes:

- Netlify is a good option if you want a clean public URL quickly.
- No redirects are required for the current query-string route.

## Vercel Option

1. Import the GitHub repository into Vercel.
2. Select branch: `sui-overflow-edumemory`.
3. Framework preset: **Other**.
4. Leave **Build command** blank.
5. Set **Output directory** to `.`
6. Deploy.

Demo URL format:

`https://YOUR-PROJECT.vercel.app/?role=edumemory`

Notes:

- Vercel can serve this as a static project.
- If Vercel asks for a build command, leave it empty or use no-op project settings.

## Local Fallback Option

From the repository root:

```bash
python3 -m http.server 4173
```

On Windows:

```powershell
python -m http.server 4173
```

Open:

`http://localhost:4173/?role=edumemory`

## Static Site Readiness Check

The app is static-site ready because:

- `index.html` is the entry point.
- Scripts are local files loaded with relative paths.
- Styles are local files loaded with relative paths.
- No server API is required for the EduMemory demo.
- Demo state uses browser `localStorage`.
- Sui and Walrus are mock records in the proof-of-concept.

## Deployment Checklist

- Confirm the branch is `sui-overflow-edumemory`.
- Confirm `index.html` loads from the deployed URL.
- Open `?role=edumemory` directly.
- Click **Analyze Growth**.
- Click **Create Learning Memory**.
- Open Teacher view and approve the credential.
- Open Portfolio and Opportunities.
- Test in an incognito/private window before submitting.
