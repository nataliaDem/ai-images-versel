# ai-images-vercel

Vercel-ready version of the AI image editor.

## Environment variables

- `OPENAI_API_KEY`
- `BAKERY_API_BASE_URL_PROD`
- `BAKERY_API_BASE_URL_STAGE`
- `IMAGE_UI_BULK_CONCURRENCY` (optional)
- `S3_BUCKET_NAME`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `SLACK_GENERATION_WEBHOOK_URL` (optional, falls back to `SLACK_WEBHOOK_URL`)
- `SLACK_PREVIEW_MAX_SIZE` (optional, default `512`, max width/height for Slack thumbnail URLs in `thumb/`)
- `OPENAI_IMAGE_RATE_LIMIT_PER_MINUTE` (optional, default `5`)
- `OPENAI_IMAGE_RATE_LIMIT_WINDOW_MS` (optional, default `60000`)

Query param:

- `env=production` or `env=stage`

## Local Vercel dev

Requirements:

- Node.js 20 or newer (production runs on Node 24). On Node 18 image generation fails with
  `Connection error.`: `node-fetch` cannot upload the source image there
  (`ERR_INVALID_STATE: chunk ArrayBuffer is zero-length or detached`).
- Vercel CLI (`npm install -g vercel`), logged in with `vercel login`.
- `.env` with the variables above (see `.env.example`).

```bash
nvm use 22
npm install
vercel link   # first time only, choose the existing `foodspace-ai-images` project
vercel dev --listen 3000
```

The app is available at `http://localhost:3000`.

## Testing with a local bakery admin

When the app runs on `localhost`, it expects the parent frame to be the bakery admin at
`http://localhost:4200` (override with the `parent_origin` query param).

1. Start this app with `vercel dev --listen 3000`.
2. In `web.bakery-admin`, temporarily set `aiImagesAppUrl` to `'http://localhost:3000/'` in
   `src/environments/environment.ts`. Do not commit this change.
3. Start the bakery admin with `npm start` (Node 20.19+) and open `http://localhost:4200` as a super admin.
4. Open a product, click "Improve image" (or open bulk improve from a category).

Local runs use the real OpenAI key, S3 bucket and Slack webhook from `.env`.

## Environments and release process

| Branch    | Vercel environment | URL                                          | Used by             |
|-----------|--------------------|----------------------------------------------|---------------------|
| `master`  | Production         | https://foodspace-ai-images.vercel.app       | prod bakery admin   |
| `release` | Preview            | https://foodspace-ai-images-stage.vercel.app | stage bakery admin  |
| any other | Preview            | generated per deployment                     | -                   |

The project is connected to GitHub: every push deploys automatically, `master` to production,
other branches to preview. The stage domain is assigned to the `release` branch in
Vercel (Settings → Domains), so it always shows the latest `release` deployment.

Process (same as the bakery admin):

1. Create the task branch from `master`, never from `release`, so that `master` only gets tested work.
2. Open a PR into `release`. After merge the stage URL is updated, test there with the stage bakery admin.
3. After testing, open a PR from `release` into `master`. After merge the production URL is updated.

If a change needs a new bakery admin version (for example a new `postMessage` field), release the
bakery admin to prod first, then merge into `master` here.

Preview deployments use the `Preview` environment variables in Vercel, check them when adding a new variable.
Deployment Protection must be off for previews, otherwise the stage URL cannot be opened in the admin iframe.
