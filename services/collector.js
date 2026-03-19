// services/collector.js
const si = require('systeminformation');

async function getMetrics() {
  const [cpu, mem, disk, services] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.services('nginx,apache2,mysql')  // adapte selon tes services
  ]);

  return {
    cpu: Math.round(cpu.currentLoad),
    memory: {
      used:  Math.round(mem.used  / 1024 / 1024),  // en Mo
      total: Math.round(mem.total / 1024 / 1024)
    },
    disk: {
      used:  Math.round(disk[0].used / 1024 / 1024 / 1024),  // en Go
      total: Math.round(disk[0].size / 1024 / 1024 / 1024)
    },
    services: services.map(s => ({
      name:   s.name,
      status: s.running ? 'active' : 'inactif'
    }))
  };
}

module.exports = { getMetrics };