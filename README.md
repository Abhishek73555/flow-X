# Flow-X: Integrated Productivity & Telemetry

Your original "Flow-X" frontend (Vite) has been restored and enhanced with full-stack telemetry tracking.

## Components

1. **Original Frontend**: (Root) Your Vite/React app with its original components and styles.
2. **Telemetry Extension**: (`/extension`) A Chrome extension that tracks domains and calculates "Deep Work" vs "Distraction" time.
3. **Telemetry Server**: (`server.js`) An Express/Prisma backend that receives and stores tracking data from the extension and provides it to your dashboard.

## How to Run

1. **Install Dependencies** (If not done yet)
   ```bash
   npm install
   cd extension && npm install && cd ..
   ```

2. **Initialize Database** (Ensure PostgreSQL is running)
   Update `.env` with your `DATABASE_URL`, then run:
   ```bash
   npx prisma db push
   ```

3. **Start Everything**
   ```bash
   npm run dev:all
   ```
   This will run your **Vite Frontend** (port 5173) and your **Telemetry Server** (port 3000) concurrently.

4. **Load the Extension**
   - Open Chrome and go to `chrome://extensions`.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `extension/dist` folder.

## New Features Added to Your UI
- **Flow-X Sync Metrics**: I added a new card to your `Dashboard` component (using your original Glassmorphism style) that pulls live tracking data from the telemetry server.
- **Background Tracking**: The extension silently maps your browsing patterns to help you reach your flow state.
