# ai-images-vercel

Vercel-ready version of the AI image editor.

## Environment variables

- `OPENAI_API_KEY`
- `BAKERY_API_BASE_URL_PROD`
- `BAKERY_API_BASE_URL_STAGE`
- `EMBED_TOKEN_SECRET`
- `IMAGE_UI_BULK_CONCURRENCY` (optional)
- `S3_BUCKET_NAME`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

Query param:

- `env=production` or `env=stage`

## Local Vercel dev

```bash
npm install
vercel dev
```
