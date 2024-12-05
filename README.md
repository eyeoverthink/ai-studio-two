# CreativeAI Studio

A comprehensive AI-powered content creation platform that enables users to create, share, and monetize various forms of digital content.

## Features

- 🎥 AI Video Generation
- 🎙️ Podcast Creation
- 📝 Blog Generation
- 🎨 Image Generation
- 🎵 Music Generation
- 🤖 AI Chatbot
- 💬 Real-time Chat
- 🎯 Social Interaction
- 💳 Credit-based Monetization
- 📚 Audio Book Creation
- 🎨 Design Studio

## Tech Stack

- Next.js 13 with App Router
- React
- TypeScript
- MongoDB
- Express.js
- Node.js
- TailwindCSS
- Shadcn UI
- Socket.io
- Cloudinary
- Clerk Authentication
- Stripe Payments
- Prisma ORM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
OPENAI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   └── types/
├── public/
├── prisma/
└── package.json

## References

Some features in this project were inspired by or reference the following repositories:
- AI Podcast and Chat functionality: [clone-test](https://github.com/eyeoverthink/clone-test.git)
