# Deployment Configuration Notes

Reference for Vercel environment variables, Resend setup, and Supabase wiring.

---

## 1. Vercel Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.
Apply each to all three environments unless noted: **Production**, **Preview**, **Development**.

### Supabase (firm site — separate from FSF)

| Variable | Where used | Notes |
|----------|-----------|-------|
| `VITE_SUPABASE_URL` | Frontend (browser) | Public-safe. From your Supabase project Settings → API. |
| `VITE_SUPABASE_ANON_KEY` | Frontend (browser) | Public-safe. From Settings → API → anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | API routes only | **NEVER expose to frontend.** From Settings → API → service_role key. Used by `api/notify-deskpet.ts` to insert requests bypassing RLS. |

### Resend (email)

| Variable | Where used | Notes |
|----------|-----------|-------|
| `RESEND_API_KEY` | API routes only | From Resend dashboard → API Keys. Starts with `re_...` |
| `RESEND_FROM_EMAIL` | API routes only | The verified sender address. Should be `noreply@dimentfirm.com` once domain is verified. |
| `RESEND_NOTIFY_EMAIL` | API routes only | Where new desk pet / registration notifications go. Default: `AMH@dimentfirm.com` |

---

## 2. Resend Sender Domain Verification

The `from` address (`noreply@dimentfirm.com`) must use a domain you own and have
verified in Resend. Until verified, emails will fail or be flagged as spam.

**Steps:**

1. Log into [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter `dimentfirm.com`
3. Resend will give you 3 DNS records to add:
   - **TXT** record at `_resend.dimentfirm.com` (DKIM)
   - **MX** record at `send.dimentfirm.com` (Resend MX)
   - **TXT** record at `send.dimentfirm.com` (SPF)
4. Add these in your DNS provider (looks like EATEL based on your nameserver `ns5.eatel.net`)
5. Wait for DNS propagation (5 min – 24 hours), then click **Verify** in Resend
6. Once verified, set `RESEND_FROM_EMAIL=noreply@dimentfirm.com` in Vercel

**Test sender:** While verifying, you can use Resend's test sender `onboarding@resend.dev`
to confirm the API integration works before your domain is ready.

---

## 3. Supabase Setup (Option 2 — Separate from FSF)

We're standing up a **new Supabase project** for the firm website, distinct from
the FSF Supabase that holds existing client registrations.

**Steps:**

1. Create a new Supabase project at [supabase.com](https://supabase.com)
   - Name suggestion: `diment-firm-site`
   - Region: **us-east-1** (closest to Louisiana)
2. Once provisioned, go to **Settings → API** and copy:
   - Project URL → set as `VITE_SUPABASE_URL` in Vercel
   - `anon public` key → set as `VITE_SUPABASE_ANON_KEY` in Vercel
   - `service_role` key → set as `SUPABASE_SERVICE_ROLE_KEY` in Vercel (server-only!)
3. Open **SQL Editor** and run the migration:
   - File: `docs/supabase-desk-pet-schema.sql`
4. Verify the table exists: **Table Editor → desk_pet_requests** should appear

---

## 4. After All Env Vars Are Set

1. Trigger a fresh deploy in Vercel (or push any commit) so the new env vars take effect
2. Test the desk pet form on the live site → should:
   - Send Alayna an email
   - Send the requester a confirmation email
   - Create a row in `desk_pet_requests`
3. Visit `/firm-admin` (passphrase: `diment-admin-2026` — change in `src/pages/FirmAdmin.tsx`)
4. The new request should appear in the Pending tab

---

## 5. Things to Change Before Going Public

- [ ] Verify `dimentfirm.com` in Resend
- [ ] Change the admin passphrase from `diment-admin-2026` to something only Alayna and Morley know
- [ ] Set up proper Supabase RLS policies (current ones allow anon read/update — see SQL file note)
- [ ] Consider rotating to authenticated admin access once Academy launches
