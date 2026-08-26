const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Check if .medusa/server exists - if not, build process failed
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  throw new Error('.medusa/server directory not found. This indicates the Medusa build process failed. Please check for build errors.');
}

// Copy public from .medusa/server to root public directory so medusa start finds index.html
const serverPublic = path.join(MEDUSA_SERVER_PATH, 'public');
const rootPublic = path.join(process.cwd(), 'public');

if (fs.existsSync(serverPublic)) {
  fs.mkdirSync(rootPublic, { recursive: true });
  fs.cpSync(serverPublic, rootPublic, { recursive: true });
  console.log('Copied .medusa/server/public to ./public successfully.');
}
