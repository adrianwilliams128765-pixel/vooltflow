# VooltFlow — Setup Guide

## Project Structure
```
src/app/
├── page.tsx              ← Homepage (marketing)
├── login/page.tsx        ← Sign in
├── signup/page.tsx       ← Create account
├── forgot-password/      ← Password reset
├── dashboard/page.tsx    ← Niche search + stats
├── products/page.tsx     ← Product discovery grid
├── product/page.tsx      ← Review & Publish detail page
├── settings/page.tsx     ← Store config + account
├── account/page.tsx      ← Profile overview
└── connect-store/page.tsx← First-time store setup
```

---

## Step 1: Create a new Next.js project

```bash
npx create-next-app@latest vooltflow --typescript --no-tailwind --no-app --no-src-dir
cd vooltflow
```

Then **copy all files from this zip** into your project, replacing everything.

Or start fresh:
```bash
mkdir vooltflow && cd vooltflow
npm init -y
```
Then copy the files, then run:
```bash
npm install
```

---

## Step 2: Create Supabase project

1. Go to https://supabase.com → New Project
2. Copy your **Project URL** and **Anon Key**
3. Go to SQL Editor → New Query → paste `SUPABASE_SCHEMA.sql` → Run

---

## Step 3: Set environment variables

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

NEXT_PUBLIC_N8N_DISCOVERY_WEBHOOK=https://n8n.srv1367100.hstgr.cloud/webhook/find-products
NEXT_PUBLIC_N8N_PUBLISHER_WEBHOOK=https://n8n.srv1367100.hstgr.cloud/webhook/publish-products
```

---

## Step 4: Update The Publisher n8n workflow

The Publisher workflow currently reads from Google Sheets.
**You need to change it to read from the webhook body instead.**

In your Publisher workflow, **replace** the "Get Unpublished Products" Google Sheets node with a **Code node** that reads from the webhook:

```javascript
// Replace "Get Unpublished Products" with this Code node
return [{
  json: {
    "Product Name": $('Webhook').first().json.body.product_name,
    "Price ": $('Webhook').first().json.body.price,
    "Affiliate Link": $('Webhook').first().json.body.affiliate_link,
    "Image Url": $('Webhook').first().json.body.image_url,
    "Youtube Video": $('Webhook').first().json.body.youtube_link,
    "Platform": $('Webhook').first().json.body.platform,
  }
}];
```

Then connect: Webhook → this Code node → Limit → Generate Description → Download Image → Format Image → Upload Image → WooCommerce → Respond to Webhook

---

## Step 5: Run the app

```bash
npm run dev
```

Open http://localhost:3000

---

## Data flow summary

### Discovery (The Affiliate workflow)
Frontend sends `{ niche: "Tech" }` → Webhook → searches Amazon/Jumia/Konga → Quality Filter → Affiliate Generator (builds `affiliate_link`) → YouTube Search → Parse YouTube Data → returns array of products with:
- `platform`, `product_name`, `price`, `product_link`, `affiliate_link`
- `image_url`, `rating`, `reviews`
- `youtube_link`, `video_title`, `video_context`

### Publishing (The Publisher workflow)
Frontend sends product data → Webhook → (Code node reads it) → Generate Description (GPT-4o) → Download Image → Format Image → Upload Image (WordPress) → WooCommerce (creates external product) → Respond to Webhook
