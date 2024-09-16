// fetch.js
import { CONFIG } from './config.js';
console.log('fetch.js');
document.addEventListener('DOMContentLoaded', () => {
 htmx.config.allowEval = false;
    htmx.config.allowScriptTags = false;
    htmx.config.allowExternalSvgSources = false;
    htmx.config.allowExternalMJPEGSources = false;
    htmx.config.allowEval = false;
    htmx.config.allowExternalRenderSources = true;

    document.body.addEventListener('htmx:configRequest', function(evt) {
        evt.detail.headers['Access-Control-Allow-Origin'] = '*';
    });
    document.body.addEventListener('htmx:afterSwap', (evt) => {
        console.log('Swap occurred', evt.detail);
        if (evt.detail.target.id === 'hx-header') {
            console.log('Header swap detected');
            const getFormButton = document.getElementById('get-form-button');
            if (getFormButton) {
                console.log('Button found, setting attribute');
                getFormButton.setAttribute('hx-get', `${CONFIG.API_BASE_URL}/form`);
                htmx.process(getFormButton);
            } else {
                console.log('Button not found');
            }
        } else if (evt.detail.target.id === 'main-content') {
            console.log('Form loaded into main content');
        } else {
            console.log('Non-header swap occurred');
        }
    });
});

// Detect HTMX errors
document.body.addEventListener('htmx:responseError', (event) => {
    console.error('HTMX response error:', event.detail);
});