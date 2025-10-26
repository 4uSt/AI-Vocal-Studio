# AI Vocal Studio

An AI-powered vocal mixing and mastering studio that provides intelligent audio analysis, guided mixing workflows, and professional-grade processing chains.

## Overview

AI Vocal Studio is a comprehensive web-based application for vocal processing that combines artificial intelligence with professional audio engineering principles. It analyzes vocal recordings, detects issues, and provides intelligent suggestions for creating polished, release-ready mixes.

## Features

### Core Capabilities

- **Audio Analysis**: Automatic detection of pitch, loudness, dynamics, sibilance, noise, resonance, transients, and more
- **Dual Mixing Modes**:
  - **Auto-Mix**: AI generates a complete, editable processing chain based on your goals
  - **Guided Mix**: Step-by-step interactive workflow with A/B comparison and explanations
- **Visual Chain Builder**: Drag-and-drop effect modules with bypass, solo, and advanced routing options
- **Real-time Visualization**: Waveform and spectrogram displays with issue highlighting
- **AI Assistant**: Natural language guidance and explanations for every mixing decision

### Processing Modules

- **Restoration**: Noise reduction, de-hum, de-click, de-reverb, de-breath, plosive control
- **Dynamics**: Gate, compressor (VCA/FET/Opto/Vari-mu), limiter, de-esser, multiband compression
- **Tonal Shaping**: Parametric EQ, linear-phase EQ, match EQ, dynamic resonance control
- **Harmonic Enhancement**: Saturation, exciters, harmonic coloration
- **Time Effects**: Reverb, delay, chorus, flanger, phaser, micro-pitch
- **Pitch/Timing**: Transparent tuning, formant control, harmony generation
- **Spatial Processing**: Stereo widening, mid/side processing, mono compatibility
- **Metering**: LUFS, true peak, phase correlation, frequency analysis

### Advanced Tools

- **Reference Matching**: Upload reference tracks and match tonal/dynamic characteristics
- **Masking Solver**: Analyze and resolve frequency conflicts with instrumental tracks
- **Descriptor-to-Action**: Translate natural language descriptions into processing chains
- **Preference Learning**: AI adapts to your mixing preferences through A/B testing
- **Health Checks**: Phase correlation, mono compatibility, headroom analysis
- **Export Options**: Human-readable chains, DAW-specific recipes, preset files

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with Carbon Design System principles
- **shadcn/ui** component library
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Express.js** server
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL (Neon)
- **WebSocket** support for real-time communication
- **OpenAI & Anthropic** AI integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional, for user data persistence)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/4uSt/AI-Vocal-Studio.git
cd AI-Vocal-Studio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a `.env` file):
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
PORT=5000
```

4. Push database schema:
```bash
npm run db:push
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
AI-Vocal-Studio/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── lib/          # Utility libraries
│       └── pages/        # Page components
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data persistence
│   └── vite.ts           # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schema
├── design_guidelines.md   # UI/UX design specifications
└── package.json          # Project dependencies
```

## Design Philosophy

The UI follows professional DAW interface principles with the Carbon Design System, emphasizing:

- **Information Density**: Maximize visible parameters without overwhelming users
- **Precision Controls**: Support for exact values and fine adjustments
- **Workflow Continuity**: Minimize context switching
- **Professional Aesthetic**: Familiar to audio engineers

See `design_guidelines.md` for complete design specifications.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Design inspired by professional DAW interfaces
- UI components from shadcn/ui
- Carbon Design System principles
- Audio processing knowledge from professional mixing engineers