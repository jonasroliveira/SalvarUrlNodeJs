const openImport = require('open');
const open = openImport.default;
const { salvarURL } = require('./db');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function abrirERegistrarURL(url) {
    try {        
        await open(url, { app: { name: edgePath } });
        await salvarURL(url);
        
    } catch (error) {
        console.error('Erro ao abrir o navegador:', error);
    }
}

module.exports = { abrirERegistrarURL };

/* const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function abrirERegistrarURL(url) {
  await open(url, { app: { name: chromePath } });
  await salvarURL(url);
}

module.exports = { abrirERegistrarURL }; */
