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
2. In `web.bakery-admin`, temporarily set `AI_IMAGES_APP_URL` to `'http://localhost:3000/'` in
   `improve-product-image-modal.component.ts` (single image) and
   `improve-images-bulk-modal.component.ts` (bulk). Do not commit this change.
3. Start the bakery admin with `npm start` (Node 20.19+) and open `http://localhost:4200` as a super admin.
4. Open a product, click "Improve image" (or open bulk improve from a category).

Local runs use the real OpenAI key, S3 bucket and Slack webhook from `.env`.
