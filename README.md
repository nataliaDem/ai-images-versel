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
- `OPENAI_IMAGE_RATE_LIMIT_PER_MINUTE` (optional, default `5`)
- `OPENAI_IMAGE_RATE_LIMIT_WINDOW_MS` (optional, default `60000`)

Query param:

- `env=production` or `env=stage`

## Local Vercel dev

```bash
npm install
vercel dev
```
