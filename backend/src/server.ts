import app from './app';
import { initDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

// Initialize Database schema
initDatabase();

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  ElderShield AI Backend running on port: ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
