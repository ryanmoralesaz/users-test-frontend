const browserSync = require('browser-sync').create();

browserSync.init({
  server: 'client/',
  // proxy: ':3000',
  files: ['client/**/*'],
  port: 5000,
  open: true, // We'll open the browser manually after both processes start
  notify: false
});

console.log('Browser-Sync is running on http://localhost:5000');