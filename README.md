# Gato Blanco Connect 🐱☕

A bilingual marketplace platform connecting [Gato Blanco](https://www.instagram.com/gatoblanco.mde/) coffee shop in Zona Rosa, Medellín with premium services for digital nomads and expats.

## 🌟 Overview

Gato Blanco Connect is a modern web application that serves as a curated marketplace for the Gato Blanco community. It bridges the gap between a beloved local coffee shop and the services digital nomads need—from housing and coworking spaces to visa assistance and local experiences.

### Key Features

- **Bilingual Interface** (English/Spanish) - Seamless language switching
- **Service Marketplace** - Curated providers across multiple categories:
  - 🏠 Housing & Accommodation
  - 💼 Coworking Spaces
  - 📝 Visa & Legal Services
  - 🎓 Language Classes
  - 🎯 Local Experiences
  - 🚗 Transportation
- **Provider Profiles** - Detailed information with photos, pricing, and contact details
- **Smart Filtering** - Filter by category, language support, and search keywords
- **Mobile-Responsive** - Optimized for all devices
- **SEO Optimized** - Metadata and structured content for search engines

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/eatsalad239/gato-blanco-connect.git

# Navigate to project directory
cd gato-blanco-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality checks
```

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
- **Lucide React** - Beautiful icon library

### State Management & Routing
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
gato-blanco-connect/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation with language toggle
│   │   ├── Hero.tsx         # Landing section
│   │   ├── ServiceCard.tsx  # Provider display cards
│   │   └── FilterBar.tsx    # Search and filtering
│   ├── data/
│   │   └── services.ts      # Service provider data
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── PRD.md                   # Product Requirements Document
├── AUDIT-FINAL.md           # Quality audit report
├── DEPLOYMENT-GUIDE.md      # Deployment instructions
└── package.json             # Project dependencies
```

## 🌐 Deployment

The application is optimized for deployment on **Netlify** with:

- Automatic builds from the main branch
- Environment variable configuration
- Custom domain support
- SSL certificates
- Global CDN distribution

For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md).

### Build Output

Production builds are optimized and output to the `dist/` directory:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps for debugging

## 🎨 Design Philosophy

- **User-Centric** - Intuitive navigation for non-technical users
- **Accessible** - WCAG-compliant components from Radix UI
- **Performance-First** - Optimized bundle sizes and lazy loading
- **Mobile-First** - Responsive design for all screen sizes
- **Brand Consistency** - Reflects Gato Blanco's aesthetic and values

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (if needed for future features):

```env
VITE_API_URL=your_api_url_here
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety. See `tsconfig.json` for details.

## 📝 Adding New Service Providers

To add new service providers, edit `src/data/services.ts`:

```typescript
{
  id: 'unique-id',
  name: { en: 'English Name', es: 'Spanish Name' },
  category: 'Housing', // or other category
  description: { en: 'English description', es: 'Spanish description' },
  price: { en: '$100/month', es: '$100/mes' },
  contact: 'contact@example.com',
  phone: '+57 123 456 7890',
  website: 'https://example.com',
  languages: ['English', 'Spanish'],
  image: '/path/to/image.jpg'
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Gato Blanco** - For the vision and community
- **Zona Rosa Community** - Digital nomads and locals who inspired this platform
- **Open Source Contributors** - All the amazing tools and libraries used

## 📧 Contact

For questions, suggestions, or partnerships:

- **Repository**: [github.com/eatsalad239/gato-blanco-connect](https://github.com/eatsalad239/gato-blanco-connect)
- **Gato Blanco Instagram**: [@gatoblanco.mde](https://www.instagram.com/gatoblanco.mde/)

## 🗺️ Roadmap

- [ ] User authentication and saved favorites
- [ ] Provider dashboard for self-service updates
- [ ] Review and rating system
- [ ] Booking integration for services
- [ ] Mobile app (React Native)
- [ ] Admin panel for content management
- [ ] Analytics dashboard for providers
- [ ] Email notifications for inquiries

---

**Built with ☕ in Medellín, Colombia**
