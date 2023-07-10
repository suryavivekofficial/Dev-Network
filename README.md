# Dev Network

This is a social media clone built using Next.js, NextAuth.js, Prisma, Tailwind CSS, tRPC and WebSockets.

## Features

- User authentication and authorization using NextAuth.js
- Real-time updates with Websockets for chatting and notifications
- CRUD operations for posts, comments, and likes
- Optimistic updates for likes and follows
- Responsive design with Tailwind CSS
- Secure and scalable data persistence with prisma and planetScale database

## Prerequisities

Before running this project, make sure you have the following installed on your machine:

- Node.js
- npm
- MySQL database

## Getting Started

1. Clone the repository:

```bash
    git clone https://github.com/thesuryavivek/Dev-Network
```

2. Navigate to the project directory:

```bash
    cd Dev-Network
```

3. Install the dependencies

```bash
    npm install
```

4. Rename .env.example to .env

```bash
    mv .env.example .env
```

5. Update the environment variables in the .env file to match your local environment setup.

6. Run the database migrations:

```bash
    npx prisma migrate dev
```

7. Start the development server:

```bash
    npm run dev
```

## Acknowledgements

- [T3 stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Pusher](https://pusher.com)
