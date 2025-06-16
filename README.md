# Chat Social App - Frontend

A modern, responsive chat application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Real-time messaging
- User profiles and settings
- Theme customization (light/dark mode)
- Responsive design for all devices

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Radix UI](https://www.radix-ui.com/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Date Formatting**: [date-fns](https://date-fns.org/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/chat-social-app.git
cd chat-social-app/chat-app-front-end
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
chat-app-front-end/
├── public/                  # Static assets
├── src/
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   │   ├── chat/            # Chat-related components
│   │   ├── providers/       # Context providers
│   │   ├── settings/        # Settings components
│   │   ├── ui/              # UI components
│   │   └── user/            # User-related components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Document components with JSDoc comments

### Component Structure

Each component should:

1. Have a clear, single responsibility
2. Be properly typed with TypeScript
3. Include proper documentation

## Deployment

The application can be deployed to Vercel or any other hosting service that supports Next.js applications.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/social-chat-app](https://github.com/yourusername/social-chat-app)
