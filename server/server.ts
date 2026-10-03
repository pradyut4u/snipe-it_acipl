import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

// Assets
app.get('/api/assets', async (req, res) => {
  const assets = await prisma.asset.findMany();
  res.json(assets);
});

app.post('/api/assets', async (req, res) => {
  const asset = await prisma.asset.create({ data: req.body });
  res.json(asset);
});

app.put('/api/assets/:id', async (req, res) => {
  const asset = await prisma.asset.update({
    where: { id: parseInt(req.params.id) as any },
    data: req.body,
  });
  res.json(asset);
});

app.delete('/api/assets/:id', async (req, res) => {
  await prisma.asset.delete({ where: { id: parseInt(req.params.id) as any } });
  res.json({ success: true });
});

// Users
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Licenses
app.get('/api/licenses', async (req, res) => {
  const items = await prisma.license.findMany();
  res.json(items);
});

// Accessories
app.get('/api/accessories', async (req, res) => {
  const items = await prisma.accessory.findMany();
  res.json(items);
});

// Consumables
app.get('/api/consumables', async (req, res) => {
  const items = await prisma.consumable.findMany();
  res.json(items);
});

// Events
app.get('/api/events', async (req, res) => {
  const items = await prisma.eventItem.findMany();
  res.json(items);
});

// ActivityLogs
app.get('/api/logs', async (req, res) => {
  const items = await prisma.activityLog.findMany();
  res.json(items);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
