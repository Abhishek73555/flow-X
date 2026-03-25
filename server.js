import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://localhost:3001'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const libsqlData = {
  url: 'file:dev.db'
};
const adapter = new PrismaLibSql(libsqlData);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3002;

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

// Socket.io for Real-Time Tasks Setup
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('taskUpdated', (data) => {
    socket.broadcast.emit('taskSync', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Telemetry endpoint for the Chrome extension
app.post('/api/telemetry', async (req, res) => {
  try {
    const { userId, telemetry } = req.body;
    if (!telemetry || !Array.isArray(telemetry)) return res.status(400).json({ error: 'Invalid telemetry data' });
    const payload = telemetry.map((entry) => ({
      userId: userId || 'anonymous',
      domain: entry.domain,
      category: entry.category,
      duration: entry.duration,
    }));
    await prisma.telemetry.createMany({ data: payload });
    res.json({ ok: true, count: payload.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/telemetry/summary', async (req, res) => {
  try {
    const categories = await prisma.telemetry.groupBy({
      by: ['category'],
      _sum: { duration: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/telemetry/domains', async (req, res) => {
  try {
    const domains = await prisma.telemetry.groupBy({
      by: ['domain', 'category'],
      _sum: { duration: true },
      orderBy: {
        _sum: {
          duration: 'desc'
        }
      }
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Flow-X Full-Stack Server running on http://localhost:${PORT}`);
});
