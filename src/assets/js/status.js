// Бейдж «Состояние сервиса» в подвале: запрашивает статус-страницу и красит индикатор.
// При ошибке или таймауте остаётся надпись по умолчанию.
(() => {
  const badge = document.getElementById('vinscan-status');
  const text = document.getElementById('vs-status-text');
  if (!badge || !text) return;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);

  fetch('https://status.vin-scan.ru/api/status-page/heartbeat/vinscan', { signal: ctrl.signal })
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    })
    .then((data) => {
      clearTimeout(timer);

      let isAllUp = true;
      if (data.heartbeatList) {
        for (const monitorId in data.heartbeatList) {
          const beats = data.heartbeatList[monitorId];
          if (beats.length > 0 && beats[beats.length - 1].status !== 1) {
            isAllUp = false;
            break;
          }
        }
      }

      badge.classList.add(isAllUp ? 'vs-status-up' : 'vs-status-down');
      text.textContent = isAllUp ? 'Все системы в норме' : 'Сбои в работе сервиса';
    })
    .catch(() => { /* остаётся «Состояние сервиса» */ });
})();
