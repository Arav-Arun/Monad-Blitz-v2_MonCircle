(function () {
  const script = document.currentScript;
  const publicKey = script.getAttribute('data-key');
  const userId = script.getAttribute('data-user-id') || 'anon_' + Math.random().toString(36).slice(2, 9);
  const baseUrl = script.getAttribute('data-api-url') || new URL(script.src).origin + '/api';
  const isAutopilot = script.getAttribute('data-autopilot') === 'true';

  if (!publicKey) {
    console.error('[MonCircle] Missing data-key attribute.');
    return;
  }

  // 1. Premium Styles (Razorpay-style Purple Theme)
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

    #mon-circle-root {
      font-family: 'Outfit', system-ui, sans-serif;
      color: #e8e4f4;
      user-select: none;
    }

    /* Floating Trigger */
    .mon-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #6e54ff;
      border: none;
      border-radius: 999px;
      padding: 12px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(110, 84, 255, 0.4);
      transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
      z-index: 999998;
    }
    .mon-trigger:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 32px rgba(110, 84, 255, 0.5);
    }
    .mon-trigger span { font-weight: 600; font-size: 14px; color: white; }
    .mon-dot { width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

    /* Full-Screen Overlay */
    .mon-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(5, 4, 15, 0.85);
      backdrop-filter: blur(12px);
      z-index: 999999;
      display: none;
      align-items: center; justify-content: center;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .mon-overlay.show { display: flex; opacity: 1; }

    /* Centered Dashboard Card */
    .mon-modal {
      background: #0f0d1a;
      border: 1px solid rgba(110, 84, 255, 0.2);
      border-radius: 24px;
      width: 420px;
      max-width: 90%;
      padding: 40px;
      position: relative;
      transform: translateY(20px);
      transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    }
    .mon-overlay.show .mon-modal { transform: translateY(0); }

    .mon-close {
      position: absolute; top: 20px; right: 20px;
      background: none; border: none; color: #6b6585;
      font-size: 24px; cursor: pointer; transition: color 0.2s;
    }
    .mon-close:hover { color: white; }

    .mon-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .mon-brand-icon { width: 32px; height: 32px; background: #6e54ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
    .mon-brand-name { font-weight: 700; font-size: 18px; letter-spacing: -0.01em; }

    .mon-stats-grid { display: grid; gap: 16px; margin-bottom: 32px; }
    .mon-stat-box { background: rgba(110, 84, 255, 0.05); border: 1px solid rgba(110, 84, 255, 0.1); padding: 20px; border-radius: 16px; }
    .mon-label { font-size: 11px; text-transform: uppercase; color: #6b6585; letter-spacing: 0.1em; margin-bottom: 4px; font-weight: 600; }
    .mon-value { font-size: 28px; font-weight: 800; color: #9d8fff; }

    .mon-btn-main {
      background: #6e54ff; color: white; border: none; width: 100%; padding: 16px; 
      border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer;
      transition: all 0.2s; box-shadow: 0 4px 12px rgba(110, 84, 255, 0.3);
    }
    .mon-btn-main:hover { background: #5a42e6; transform: translateY(-2px); }

    /* Toast Notifications */
    .mon-toast {
      position: fixed; top: 32px; right: 32px; background: #22c55e; color: white;
      padding: 16px 28px; border-radius: 12px; font-weight: 700; z-index: 1000001;
      box-shadow: 0 10px 20px rgba(34,197,94,0.3);
      animation: toastIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
      display: flex; align-items: center; gap: 12px;
    }
    @keyframes toastIn { from { transform: translateX(100%) scale(0.9); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
    .mon-toast.out { transform: translateY(-20px); opacity: 0; transition: all 0.3s; }
  `;
  document.head.appendChild(style);

  // 2. Create DOM elements
  const root = document.createElement('div');
  root.id = 'mon-circle-root';
  root.innerHTML = `
    <button class="mon-trigger" id="mon-trigger">
      <div class="mon-dot"></div>
      <span id="mon-trigger-text">Rewards Active</span>
    </button>

    <div class="mon-overlay" id="mon-overlay">
      <div class="mon-modal">
        <button class="mon-close" id="mon-close">&times;</button>
        <div class="mon-brand">
          <div class="mon-brand-icon">M</div>
          <div class="mon-brand-name">MonCircle Rewards</div>
        </div>
        
        <div class="mon-stats-grid">
          <div class="mon-stat-box">
            <div class="mon-label">Available Balance</div>
            <div class="mon-value" id="mon-balance">0.00 MON</div>
          </div>
          <div class="mon-stat-box">
            <div class="mon-label">Pending Rewards</div>
            <div class="mon-value" id="mon-pending" style="color: #22c55e">+0.00 MON</div>
          </div>
        </div>

        <button class="mon-btn-main" id="mon-withdraw-btn">Redeem as Discount</button>
        <div style="margin-top: 24px; text-align: center; color: #3d3a52; font-size: 11px; font-weight: 600; letter-spacing: 0.05em;">
          POWERED BY MONCIRCLE PROTOCOL
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // 3. Logic Layer
  const trigger = document.getElementById('mon-trigger');
  const overlay = document.getElementById('mon-overlay');
  const closeBtn = document.getElementById('mon-close');
  const balanceEl = document.getElementById('mon-balance');
  const triggerText = document.getElementById('mon-trigger-text');
  const pendingEl = document.getElementById('mon-pending');

  const toggleOverlay = (show) => {
    if (show) {
      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('show'), 10);
    } else {
      overlay.classList.remove('show');
      setTimeout(() => overlay.style.display = 'none', 400);
    }
  };

  trigger.onclick = () => toggleOverlay(true);
  closeBtn.onclick = () => toggleOverlay(false);
  overlay.onclick = (e) => { if (e.target === overlay) toggleOverlay(false); };

  function showToast(reward) {
    const toast = document.createElement('div');
    toast.className = 'mon-toast';
    toast.innerHTML = `<span>You earned <b>+${reward} MON</b> rewards!</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  async function processOrder(orderId, rewardAmount) {
    try {
      const apiRes = await fetch(`${baseUrl}/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': publicKey },
        body: JSON.stringify({
          orderId,
          userId,
          amount: script.getAttribute('data-amount') || 0,
          monAmount: rewardAmount
        })
      });
      const result = await apiRes.json();
      showToast(rewardAmount);
      init(); // Refresh
      return result;
    } catch (err) {
      console.error('[MonCircle] Order processing failed:', err);
    }
  }

  async function init() {
    try {
      // Get Balance & Stats
      const res = await fetch(`${baseUrl}/v1/platform/stats?apiKey=${publicKey}`);
      const data = await res.json();

      const balanceRes = await fetch(`${baseUrl}/v1/balance/${userId}?apiKey=${publicKey}`);
      const bData = await balanceRes.json();

      const reward = Number(script.getAttribute('data-mon-amount')) || (script.getAttribute('data-amount') / 100) * 10 || 1.0;

      balanceEl.innerText = \`\${bData.balance || 0} MON\`;
      triggerText.innerText = \`Earn \${reward} MON Rewards\`;
      pendingEl.innerText = \`+\${reward} MON\`;

      if (isAutopilot) {
        window.addEventListener('mon-purchase-success', (e) => {
          const detail = e.detail || {};
          processOrder(detail.orderId || 'TXN-' + Date.now(), detail.monAmount || reward);
        });
      }

      // Expose API
      window.MonCircle = {
        processOrder: (id, amt) => processOrder(id, amt || reward),
        open: () => toggleOverlay(true),
        close: () => toggleOverlay(false)
      };

    } catch (err) {
      console.error('[MonCircle] Init Error:', err);
    }
  }

  init();
})();
