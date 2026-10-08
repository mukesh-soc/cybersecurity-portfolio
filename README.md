# Mukesh Jena | Cybersecurity Portfolio

Production-ready React + Vite cybersecurity portfolio with Three.js visuals, real project evidence, your profile photo, responsive navigation, project filters, evidence modals, and deployment configuration.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
```

The deployable output is generated in `dist/`. Vite documents `vite build` as the production build and `dist` as the default static output.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Framework: Vite (auto-detected).
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Deploy to Netlify

The included `netlify.toml` already defines:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback
- Basic security headers

Connect the GitHub repository to Netlify and deploy the production branch.

## Deploy to GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys the site on pushes to `main` or `master`. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the source.

The Vite config uses a relative production base so the site can work from a repository sub-path as well as a root domain.

## Project evidence

Real evidence is stored under `public/evidence/assets/`. No fabricated certification completion is claimed. Learning items are explicitly labelled as in progress, learning, or planned.
