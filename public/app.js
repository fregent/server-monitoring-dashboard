// public/app.js

// ─── Seuils d'alerte ──────────────────────────────────────────
const THRESHOLDS = {
  cpu:    { warning: 60, danger: 80 },
  memory: { warning: 70, danger: 90 },  // en %
  disk:   { warning: 70, danger: 90 }   // en %
};

// ─── Logout ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.textContent = 'Déconnexion';
  btn.style.cssText = 'padding:0.4rem 1rem;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;';
  btn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  });
  document.querySelector('header').appendChild(btn);
});

// ─── Redémarrage de service ───────────────────────────────────
async function restartService(name) {
  if (!confirm(`Redémarrer ${name} ?`)) return;
  try {
    const res = await fetch(`/api/services/${name}/restart`, { method: 'POST' });
    const data = await res.json();
    alert(res.ok ? data.message : `Erreur : ${data.error}`);
  } catch (e) {
    alert('Erreur réseau');
  }
}

// ─── Initialisation des graphiques ───────────────────────────
function createDoughnutChart(id, label, color) {
  const ctx = document.getElementById(id).getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],
        backgroundColor: [color, '#2e3244'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '75%',
      plugins: { legend: { display: false } },
      animation: { duration: 400 }
    }
  });
}

const charts = {
  cpu:    createDoughnutChart('chart-cpu',    'CPU',    '#3b82f6'),
  memory: createDoughnutChart('chart-memory', 'RAM',    '#8b5cf6'),
  disk:   createDoughnutChart('chart-disk',   'Disque', '#06b6d4')
};

// ─── Mise à jour d'une carte avec alerte couleur ─────────────
function updateCard(cardId, percent, thresholds) {
  const card = document.getElementById(cardId);
  card.classList.remove('warning', 'danger');

  if      (percent >= thresholds.danger)  card.classList.add('danger');
  else if (percent >= thresholds.warning) card.classList.add('warning');
}

function updateChart(chart, value) {
  chart.data.datasets[0].data = [value, 100 - value];
  chart.update();
}

// ─── Rendu des métriques ──────────────────────────────────────
function renderMetrics(data) {

  // CPU
  const cpuPct = data.cpu;
  updateChart(charts.cpu, cpuPct);
  updateCard('card-cpu', cpuPct, THRESHOLDS.cpu);
  document.getElementById('value-cpu').textContent = `${cpuPct}%`;

  // Mémoire
  const memPct = Math.round((data.memory.used / data.memory.total) * 100);
  updateChart(charts.memory, memPct);
  updateCard('card-memory', memPct, THRESHOLDS.memory);
  document.getElementById('value-memory').textContent =
    `${data.memory.used} Mo / ${data.memory.total} Mo`;

  // Disque
  const diskPct = Math.round((data.disk.used / data.disk.total) * 100);
  updateChart(charts.disk, diskPct);
  updateCard('card-disk', diskPct, THRESHOLDS.disk);
  document.getElementById('value-disk').textContent =
    `${data.disk.used} Go / ${data.disk.total} Go`;

  // Services
  const list = document.getElementById('services-list');
  list.innerHTML = data.services.map(s => `
    <li>
      <span>${s.name}</span>
      <span class="status-${s.status}">${s.status}</span>
      <button onclick="restartService('${s.name}')"
        style="padding:0.2rem 0.6rem;background:#3b82f6;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:0.8rem;">
        ↺ Restart
      </button>
    </li>
  `).join('');

  // Horodatage
  document.getElementById('last-update').textContent =
    `Dernière mise à jour : ${new Date().toLocaleTimeString()}`;
}

// ─── Fetch + rafraîchissement automatique ────────────────────
async function fetchMetrics() {
  try {
    const response = await fetch('/api/metrics');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderMetrics(data);
  } catch (error) {
    console.error('Erreur récupération métriques :', error);
  }
}

// Premier appel immédiat, puis toutes les 5 secondes
fetchMetrics();
setInterval(fetchMetrics, 5000);