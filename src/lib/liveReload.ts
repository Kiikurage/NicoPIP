const LIVE_RELOAD_HOST = 'localhost';
const LIVE_RELOAD_PORT = 35729;
const connection = new WebSocket(`ws://${LIVE_RELOAD_HOST}:${LIVE_RELOAD_PORT}/livereload`);

connection.addEventListener('error', (err) => {
    console.log('reload connection got error:', err);
});

connection.addEventListener('message', (message) => {
    if (message.data) {
        const data = JSON.parse(message.data);
        if (data['command'] === 'reload') {
            chrome.runtime.reload();
        }
    }
});

console.log('loaded at ' + new Date().toLocaleString());
