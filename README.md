# SkillStacks

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

**Stop Learning. Start Executing.**

SkillStacks is a premium SaaS platform delivering curated, action-oriented playbooks for developers. Forget passive tutorials — SkillStacks gives you structured execution frameworks to ship faster and build better.

**Live:** [skill-stacks.vercel.app](https://skill-stacks.vercel.app)

## Overview

- 500+ learners onboarded
- 3 premium playbooks covering modern developer workflows
- Built for developers who want to execute, not just learn

## Features

- **Playbook library** — structured, step-by-step execution guides for real dev workflows
- **Stripe payments** — one-time and subscription billing for premium content
- **Firebase Auth** — Google OAuth + email/password authentication
- **Firestore database** — real-time content delivery and user state
- **Protected routes** — content gating based on purchase/subscription status
- **Responsive UI** — built with Tailwind CSS and shadcn/ui

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Payments | Stripe |
| UI | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Auth and Firestore enabled
- Stripe account with API keys

### Installation

```bash
git clone https://github.com/bijudamian/SkillStacks
cd SkillStacks
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Run

```bash
npm run dev
```

## License

MIT — built by [Biju Damian](https://github.com/bijudamian)
