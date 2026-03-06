# POETrade WebUI

A Path of Exile currency and item price monitoring dashboard built with React, TypeScript, and Vite.

**Live Demo:** https://shdann.github.io/orchestrator/

## Features

- 📊 **Real-time Currency Rates** - Track all POE currencies with live pricing from poe.ninja
- 💎 **Divine Ratio Display** - Prominent Divine Orb to Chaos Orb exchange rate
- 📈 **24h Price Changes** - Visual indicators for price movements
- 🏆 **Top Items Tracking** - Monitor high-value unique items and divination cards
- 🔔 **Custom Alerts** - Set price alerts and get notified when thresholds are triggered
- 💡 **Trade Opportunities** - Automated detection of profitable flips and buy-the-dip opportunities
- 🎨 **Dark POE Theme** - Beautiful dark mode inspired by Path of Exile
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library
- **poe.ninja API** - Free, no-auth data source

## Project Structure

```
POETrade/
├── src/
│   ├── api/
│   │   └── poe.ts              # POE.ninja API client
│   ├── components/
│   │   ├── AlertsPanel.tsx      # Alert management UI
│   │   ├── CurrencyCard.tsx     # Currency rate card
│   │   ├── Dashboard.tsx        # Main dashboard layout
│   │   ├── Header.tsx           # Top navigation bar
│   │   ├── ItemPriceTable.tsx   # Item price table
│   │   └── TradeOpportunities.tsx # Trade opportunities list
│   ├── hooks/
│   │   ├── useAlerts.ts         # Alert state management
│   │   └── usePoeData.ts        # Data fetching hook
│   ├── types/
│   │   └── poe.ts               # TypeScript types
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── dist/                        # Build output (for deployment)
├── index.html                   # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts               # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone https://github.com/shdann/orchestrator.git
cd orchestrator/src/POETrade

# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The build output is in the `dist/` directory.

## Deployment

### GitHub Pages Deployment

This project is configured to deploy to GitHub Pages as a subdirectory at `/orchestrator/POETrade/`.

#### Option 1: Manual Deployment

```bash
# Build the project
npm run build

# Copy dist/* to your GitHub repo's POETrade/ directory
cp -r dist/* /path/to/orchestrator/POETrade/

# Commit and push
cd /path/to/orchestrator
git add POETrade/
git commit -m "chore: update POETrade WebUI"
git push origin main
```

#### Option 2: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy-poetrade.yml`:

```yaml
name: Deploy POETrade WebUI

on:
  push:
    branches: [main]
    paths: ['src/POETrade/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd src/POETrade
          npm ci

      - name: Build
        run: |
          cd src/POETrade
          npm run build

      - name: Deploy
        run: |
          git config user.email "action@github.com"
          git config user.name "GitHub Action"
          git add POETrade/
          git diff --quiet && git diff --staged --quiet || git commit -m "ci: deploy POETrade build [skip ci]"
          git push
```

### Vercel/Netlify Deployment

1. Connect your GitHub repo
2. Set **Root Directory** to `src/POETrade`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`

## Configuration

### Base Path

The `base` path in `vite.config.ts` is set to `/orchestrator/POETrade/` for GitHub Pages. Change this for other deployment targets:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/your-custom-path/',  // or '/' for root domain
  // ...
})
```

### League Selection

The app defaults to the "Mercenaries" league. To change the default league, edit the initial value in `Dashboard.tsx`:

```typescript
const {
  // ...
} = usePoeData('Your-League-Name');  // Change here
```

## Features in Detail

### Currency Monitoring

- Real-time rates from poe.ninja
- Visual sparklines showing price trends
- 24h percentage changes with color coding
- Divine Orb exchange rate badge

### Item Tracking

- Top 20 high-value unique items
- Divination cards, skill gems, and more
- Sortable by chaos value, divine value, or 24h change
- Filter by category

### Alerts

- Set alerts when items go above or below a threshold
- Choose alert currency (Chaos or Divine)
- Persistent storage in localStorage
- Visual notification when alerts trigger

### Trade Opportunities

- Currency flip detection (buy low, sell high)
- Buy-the-dip suggestions for high-value items
- Profit estimates with confidence levels
- Links to poe.ninja for verification

## API Usage

This project uses the [poe.ninja API](https://poe.ninja/api/data/) which is:
- ✅ Free
- ✅ No authentication required
- ✅ CORS-enabled for browser access
- ✅ Updated in real-time

Rate limits:
- Currency data: 5-minute cache
- Item data: 15-minute cache
- Historical data: 1-hour cache

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- [poe.ninja](https://poe.ninja/) for providing free price data
- [Path of Exile](https://www.pathofexile.com/) by Grinding Gear Games
- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility framework
- [Lucide](https://lucide.dev/) for the icon set

---

Built with ❤️ for the Path of Exile community
