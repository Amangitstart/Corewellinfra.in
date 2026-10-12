# Corewell Infra Developers website

A fast, mobile-friendly website for Corewell Infra Developers (Shivpur, Varanasi).
Visitors can browse services and photos, and send a quote request (name, phone, location).
Every request is saved in your **Supabase** database. After sending, the visitor sees a thank-you and your business card.

Built with **React + Vite**. It is deployed as a static site on **Vercel**.

---

## 1. Run it on your computer

You need **Node.js 20 or newer** (https://nodejs.org, choose "LTS").

```bash
npm install                 # downloads the tools (once)
cp .env.example .env        # creates your private settings file (on Windows: copy .env.example .env)
# open .env and fill in the values (see section 2)
npm run dev                 # starts the site at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | Starts the site for editing. Changes show instantly. |
| `npm test` | Runs the automatic tests (phone checking and lead saving). |
| `npm run build` | Makes the final website in the `dist` folder. |
| `npm run preview` | Shows the built website locally, to check it before publishing. |

## 2. Settings (environment variables)

Copy `.env.example` to `.env` and fill in:

| Name | Required | What to put |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase > Project Settings > API > **Project URL** |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase > Project Settings > API Keys > **Publishable key** (`sb_publishable_...`) or the older **anon** key |
| `VITE_SITE_URL` | Before launch | Your final address, like `https://yourdomain.com` (no slash at the end). Used for Google tags and the sitemap. |
| `VITE_GA_MEASUREMENT_ID` | No | Google Analytics ID. Leave empty to keep analytics and the cookie banner **off**. |
| `VITE_LEADS_NAME_COLUMN` | No | `name` (default) or `full_name`, whichever your leads table uses. |

**Safety rules**
- The publishable key is made for browsers. It can only do what your database security rules allow.
- **Never** put the **secret** key or the **service_role** key in this project, in `.env`, or in Vercel's `VITE_` variables.
- `.env` is ignored by Git, so it is never uploaded to GitHub. Only `.env.example` (with fake values) is uploaded.

## 3. Check your Supabase security (important)

Open `supabase/leads-security-check.sql`, paste it into **Supabase > SQL Editor** and read the result of the first query.
A healthy `leads` table has:
- columns `id`, `created_at`, `name` (or `full_name`), `phone`, `location`
- `rls_enabled = true`
- **one INSERT policy** for `anon` (or `public`), and **no** select / update / delete policy
- permissions for `anon`: **INSERT only**

If a test shows the error `permission denied for table leads`, run step 2 of that file (`grant insert ...`).
Since 30 May 2026 new Supabase tables are not open to the browser until you grant that permission.

The website **adds** leads only. It never reads them back, so visitors cannot see anyone's details.
You read your leads in **Supabase > Table Editor > leads**.

## 4. Test the lead form

1. Open the site, fill the quote form and press **Request a call back**.
2. You should see "Thank you!" and the business card.
3. In Supabase open **Table Editor > leads**. A new row should be there. Delete test rows afterwards.

If it says "Sorry, we could not send...", add `?debug=1` to the end of the page address (for example `http://localhost:5173/?debug=1`) and submit again.
A grey line then shows the real reason, for example:

| Message | Meaning and fix |
|---|---|
| `42501 permission denied for table leads` | Run `grant insert on public.leads to anon;` (see section 3). |
| `42501 new row violates row-level security policy` | The INSERT policy does not allow `anon`. Create it (step 3 in the SQL file). |
| `PGRST204 Could not find the ... column` | Column names differ. The site already retries with the other spelling (`name` / `full_name`). If it still fails, check your column names. |
| `Invalid API key` | Check `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| `Failed to fetch` | The browser could not reach Supabase (no internet, ad blocker, wrong URL). |
| `23514 ... check constraint` | A database rule rejected the value, for example a phone format. |

The phone check accepts Indian numbers (`98765 43210`, `+91 98765 43210`, landlines with an STD code) and international numbers that start with `+`.
If your table has a rule that only allows 10-digit mobiles, relax it to match (see the optional step 4 in the SQL file).

## 5. Put it on GitHub

1. Create an **empty** repository on github.com (no README, no .gitignore).
2. In this folder:

```bash
git init
git add .
git status          # check: there must be NO ".env" and NO "node_modules" in the list
git commit -m "Corewell Infra Developers website"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

## 6. Publish on Vercel

1. Go to vercel.com, sign in with GitHub, click **Add New > Project** and pick the repository.
2. Use these settings (Vercel detects most of them):

| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x or 22.x |

3. Open **Environment Variables** and add the names from section 2 (at least `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; add `VITE_SITE_URL` once you know the domain).
4. Click **Deploy**. Every later `git push` updates the live site automatically.
5. Add your domain in **Settings > Domains**, then set `VITE_SITE_URL` to it and redeploy.

`vercel.json` already contains: page-refresh support for every page address (including the policy pages), safe security headers, and caching for images.

## 7. Where things are

```
public/            files served as they are (photos in public/images, favicon)
src/
  config/          site.js = phone, email, address (edit here); env.js = settings
  data/            text and photo lists: services, products, faqs, photos
  sections/        one file per home page section (Hero, Services, Quote, FAQ...)
  components/
    layout/        header, footer, floating buttons, cookie banner
    quote/         the lead form, thank-you and business card
    common/        photo gallery, photo viewer, icons
  pages/           Home, the four policy pages (pages/legal), 404
  components/legal the shared frame used by every policy page
  lib/             supabase.js (connection), leads.js (saving a lead)
  hooks/ utils/    small helpers (scroll effects, phone check, card download)
  styles/          CSS split by topic. index.css lists them. KEEP THE IMPORT ORDER.
supabase/          database security check and fix (SQL)
scripts/           creates robots.txt and sitemap.xml at build time
tests/             automatic tests
```

**Common edits**
- Phone, email, address: `src/config/site.js`
- Services text: `src/data/services.jsx`. FAQ: `src/data/faqs.js`. Products: `src/data/products.js`
- Add a photo: copy it to `public/images`, add a line in `src/data/photos.js`
- Colours: `src/styles/variables.css`
- Policy text: `src/pages/legal/`. Please have them reviewed before relying on them.
- Policy page addresses and the footer "Legal" list: `src/config/routes.js`

## 8. Policy pages

The policies never appear on the home page. Visitors open them from the **Legal** section in the footer:

| Page | Address |
|---|---|
| Privacy Policy | `/privacy-policy` |
| Terms and Conditions | `/terms-and-conditions` |
| Refund and Cancellation Policy | `/refund-policy` |
| Cookie Policy | `/cookie-policy` |

Each page has a "Back to home" link, the normal header and footer, and works when opened or refreshed directly.
The old short addresses (`/privacy`, `/terms`, `/refunds`) forward to the new ones.
To add or rename a policy page: add its component in `src/pages/legal/`, then add it in `src/config/routes.js` and `src/App.jsx`.

## 9. Notes and limits

- Spam protection: a hidden trap field plus database rules. There is no per-visitor rate limit. If spam appears, add Cloudflare Turnstile with a Supabase Edge Function that checks it.
- The feedback form sends feedback to your WhatsApp. It is not stored in the database.
- The old "Ask us" chat box was removed. It needed a paid server.
- `public/robots.txt` and `public/sitemap.xml` are created by `npm run build` from `VITE_SITE_URL`. They are not stored in Git.
# Corewellinfra.in
