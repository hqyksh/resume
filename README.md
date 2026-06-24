# Victor Zhou - Personal Portfolio

A modern, multilingual personal portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Multilingual Support**: English and Chinese (中文)
- 🎨 **Dark Mode**: Seamless theme switching
- 📱 **Responsive Design**: Mobile-first approach
- ⚡ **Performance Optimized**: Built with Next.js 15 and Turbopack
- 🔍 **SEO Friendly**: Optimized metadata and structure
- 🎭 **Smooth Animations**: Framer Motion animations
- 📝 **Blog System**: Integrated with Supabase and Meilisearch

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, DaisyUI
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase
- **Search**: Meilisearch
- **Deployment**: Standalone mode ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   └── [lang]/          # Multilingual routes
│       ├── blog/        # Blog pages
│       ├── education/   # Education section
│       ├── experience/  # Experience section
│       ├── project/     # Projects showcase
│       └── resume/      # Resume viewer
├── components/          # Reusable components
│   ├── animation/       # Animation components
│   ├── navbar/          # Navigation components
│   └── ui/              # UI components (shadcn)
├── content/             # Content configuration
├── dictionaries/        # i18n translations
├── lib/                 # Utility functions
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding Content

1. **Update translations**: Edit files in `dictionaries/`
2. **Modify content**: Update JSON files in `content/`
3. **Add projects**: Edit `content/project.json`
4. **Update experience**: Edit `content/experience.json`

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Theme colors: Modify in `app/globals.css`

## Deployment

This project is configured for standalone deployment:

```bash
npm run build
```

The build output will be in `.next/standalone/` directory.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## License

MIT License - feel free to use this project for your own portfolio!

## Contact

- Email: alexy55@163.com
- Portfolio: [Your URL]

---

Built with ❤️ using Next.js
