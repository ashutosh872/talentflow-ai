import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('=================================================================');
console.log('  ASHUTOSH KUMAR — PUBLIC SECURE TUNNEL (CLOUDFLARE)');
console.log('  Allows access from any phone on 4G/5G without being on Wi-Fi!');
console.log('=================================================================\n');

function startTunnel() {
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  console.log('[Tunnel] Spawning fresh cloudflared tunnel...');
  
  const tunnel = spawn(npxCmd, ['--yes', 'cloudflared', 'tunnel', '--url', 'http://localhost:5000'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  });

  let tunnelUrl = '';

  function checkOutput(data) {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !tunnelUrl) {
      tunnelUrl = match[0];
      console.log('\n=================================================================');
      console.log('  🎉 PUBLIC ONLINE TUNNEL ACTIVE! ACCESS FROM ANY PHONE ANYWHERE:');
      console.log(`     👉 ${tunnelUrl}`);
      console.log('=================================================================');
      console.log('  📱 Open this link on your phone (Cellular 4G/5G, no Wi-Fi needed)');
      console.log('  🔗 Share this link with any other phone via WhatsApp, AirDrop, SMS');
      console.log('=================================================================\n');

      try {
        const dataDir = path.resolve('data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(path.join(dataDir, 'tunnel-url.txt'), tunnelUrl, 'utf8');
      } catch (e) {}
    }

    // Auto-recovery if Cloudflare session expires
    if (text.includes('Unauthorized: Tunnel not found') || text.includes('failed to request quick Tunnel')) {
      console.warn('[Tunnel] Cloudflare session expired or rejected. Terminating process to trigger fresh tunnel spawn...');
      try { tunnel.kill(); } catch (e) {}
    }
  }

  tunnel.stdout.on('data', checkOutput);
  tunnel.stderr.on('data', checkOutput);

  tunnel.on('close', (code) => {
    console.log(`[Tunnel] Closed with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });

  return tunnel;
}

startTunnel();
