# Design Tokens Pipeline

This repository stores design tokens in `tokens.json` and generates a ready-to-serve CSS file.

It also stores canonical SVG icons in `icons/` and builds a web-consumable icon output in `dist/icons/web/`.

## Output

Build command creates:

- `dist/tokens.css`
- `dist/icons/web/mono/*.svg`
- `dist/icons/web/colored/*.svg`

The CSS file contains:

- `:root` variables (global + components + light theme as default)
- `[data-theme="dark"]` overrides for dark theme

## Local build

Requirements:

- Node.js 18+

Run:

```bash
node scripts/build-css.mjs
```

Or with npm:

```bash
npm run build:css
npm run build:icons
```

### Icons

Source of truth:

- `icons/mono/*.svg`
- `icons/colored/*.svg`

Build output for web:

- `dist/icons/web/mono/*.svg`
- `dist/icons/web/colored/*.svg`

The icons build copies already cleaned SVG files from `icons/` into a stable consumable output for `web`.
It does not re-optimize or transform the files.

## GitLab CI/CD

Pipeline file: `.gitlab-ci.yml`

Stages:

1. `build_css` - generates `dist/tokens.css` and stores it as artifact.
2. `build_icons` - generates `dist/icons/web/*` and stores them as artifact.
3. `deploy_css` - uploads `dist/tokens.css` to your server via `rsync` over SSH.
4. `deploy_icons` - uploads `dist/icons/web/*` to your server via `rsync` over SSH.

### Required CI/CD variables

Set these in GitLab project settings (`Settings -> CI/CD -> Variables`):

- `SSH_HOST` - target server host
- `SSH_PORT` - optional, default `22`
- `SSH_USER` - SSH user
- `SSH_PRIVATE_KEY` - private key for deploy user (plain or file variable)
- `SSH_PRIVATE_KEY_DEPLOY` - optional override key for deploy job (if not set, `SSH_PRIVATE_KEY` is used)
- `DEPLOY_PATH` - absolute directory on server where `tokens.css` must be uploaded
- `ICONS_DEPLOY_PATH` - absolute directory on server that is served as `https://web.101-app.com/design-icons/`

Optional (recommended):

- `SSH_KNOWN_HOSTS` - prefilled known_hosts entry for strict host verification

Deploy jobs run only on default branch and only when required variables are present.

## Server result

After successful deploy, files will be available at:

- `${DEPLOY_PATH}/tokens.css`
- `${ICONS_DEPLOY_PATH}/mono/*.svg`
- `${ICONS_DEPLOY_PATH}/colored/*.svg`

Expected public URLs:

- `https://web.101-app.com/assets/tokens.css`
- `https://web.101-app.com/design-icons/mono/analytics.svg`
- `https://web.101-app.com/design-icons/colored/balance-project-own.svg`
