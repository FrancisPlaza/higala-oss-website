# Higala preview site

Static Astro pages for the Higala website preview. The public copy describes intended scope and does not claim that a downloadable release is available.

Preview: https://francisplaza.github.io/higala-oss-website/

This repository contains the marketing website, not the banking platform source code.

## Run locally

```sh
npm ci
npm run dev
```

Astro serves the preview at `http://127.0.0.1:4321/higala-oss-website/` by default. If that port is occupied, Astro selects the next available port and prints the address. Node 24 is used for deployment; Python 3 runs the static link check.

## Check and build

```sh
npm run check
npm run build
npm run check:build
```

The production files are written to `dist/`. The build check verifies all local routes, fragments, assets, ARIA references, and the GitHub Pages base path. Run `npm run preview` to inspect the built site locally.

## Deployment

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy.yml`. The workflow checks and builds the site, then publishes `dist/` to GitHub Pages. It can also be started manually from the Actions tab. Pages uses GitHub Actions as its source.

`astro.config.mjs` configures the project path `/higala-oss-website`. Internal links and public assets use the shared URL helper; Vite prefixes CSS font URLs during the build. If the deployment path changes, update the Astro configuration and the base argument in `check:build` together.

The preview retains `noindex, nofollow` on every page. Its `robots.txt` is included in the project output, but crawlers only apply a robots file at the origin root, so the page metadata is the indexing control here. There is no canonical URL or sitemap pending a final launch domain. This is a publicly accessible preview; noindex is not access control.

The separate `higala-website` repository and `new.higala.ph` deployment are not managed by this repository.
