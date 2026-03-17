# SkillStacks Deployment Guide

## Pre-Deployment Checklist

1. **Push repo to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SkillStacks MVP"
   git remote add origin https://github.com/YOUR_USERNAME/skillstacks.git
   git push -u origin main
   ```

2. **Connect repo to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import your GitHub repo
   - Framework: Next.js (auto-detected)

3. **Add all env vars from `.env.example` to Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add each variable from `.env.example` with their production values

4. **Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

5. **Run seed script against production MongoDB**
   ```bash
   MONGODB_URI=your_production_uri npx ts-node --project tsconfig.json scripts/seed.ts
   ```

6. **Upload real PDFs to `/public/pdfs/`**
   - Replace placeholder PDFs with actual playbook content
   - Filenames must match: `investing-playbook.pdf`, `body-transformation.pdf`, `youtube-automation.pdf`

7. **Test Stripe checkout with test card**
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date
   CVC: Any 3 digits
   ```

8. **Switch Stripe keys to live when ready**
   - Replace `sk_test_` with `sk_live_` in Vercel env vars
   - Replace `pk_test_` with `pk_live_` in Vercel env vars
   - Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

## Post-Deployment Verification

- [ ] Landing page loads correctly
- [ ] All 3 product pages render
- [ ] Stripe checkout redirects work
- [ ] Success page shows download link
- [ ] PDFs download correctly
- [ ] Mobile responsive layout works
