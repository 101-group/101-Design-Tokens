# Design Tokens Pipeline

This repository stores design tokens in `tokens.json` and generates a ready-to-serve CSS file.

## Output

Build command creates:

- `dist/tokens.css`

The file contains:

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
```

## GitLab CI/CD

Pipeline file: `.gitlab-ci.yml`

Stages:

1. `build_css` - generates `dist/tokens.css` and stores it as artifact.
2. `deploy_css` - uploads `dist/tokens.css` to your server via `rsync` over SSH.

### Required CI/CD variables

Set these in GitLab project settings (`Settings -> CI/CD -> Variables`):

- `SSH_HOST` - target server host
- `SSH_PORT` - optional, default `22`
- `SSH_USER` - SSH user
- `SSH_PRIVATE_KEY` - private key for deploy user (plain or file variable)
- `SSH_PRIVATE_KEY_B64` - alternative: base64 encoded private key (recommended if multiline key formatting breaks in UI)
- `DEPLOY_PATH` - absolute directory on server where `tokens.css` must be uploaded

Optional (recommended):

- `SSH_KNOWN_HOSTS` - prefilled known_hosts entry for strict host verification

Deploy job runs only on default branch and only when required variables are present.

## Server result

After successful deploy, file will be available at:

- `${DEPLOY_PATH}/tokens.css`
