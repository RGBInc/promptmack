// PWA Check Script
(function() {
  function checkPWA() {
    const results = {
      serviceWorker: 'navigator.serviceWorker' in window,
      connectivity: navigator.onLine,
      manifest: !!document.querySelector('link[rel="manifest"]'),
      https: window.location.protocol === 'https:',
      localStorage: !!window.localStorage,
      serviceWorkerRegistered: false,
      installPromptSupported: false
    };

    let logStyles = {
      pass: 'color: green; font-weight: bold',
      fail: 'color: red; font-weight: bold',
      header: 'color: blue; font-weight: bold; font-size: 1.2em',
      subheader: 'color: purple; font-weight: bold'
    };

    console.log('%c📱 Promptmack PWA Status Check', logStyles.header);
    console.log('%cEnvironment', logStyles.subheader);
    console.log(`%c${results.https ? '✅' : '❌'} HTTPS: ${results.https}`, results.https ? logStyles.pass : logStyles.fail);
    console.log(`%c${results.connectivity ? '✅' : '❌'} Online: ${results.connectivity}`, results.connectivity ? logStyles.pass : logStyles.fail);
    
    console.log('%cPWA Requirements', logStyles.subheader);
    console.log(`%c${results.serviceWorker ? '✅' : '❌'} Service Worker API: ${results.serviceWorker}`, results.serviceWorker ? logStyles.pass : logStyles.fail);
    console.log(`%c${results.manifest ? '✅' : '❌'} Web Manifest: ${results.manifest}`, results.manifest ? logStyles.pass : logStyles.fail);
    console.log(`%c${results.localStorage ? '✅' : '❌'} Local Storage: ${results.localStorage}`, results.localStorage ? logStyles.pass : logStyles.fail);

    // Check if service worker is registered
    if (results.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        results.serviceWorkerRegistered = registrations.length > 0;
        console.log(`%c${results.serviceWorkerRegistered ? '✅' : '❌'} Service Worker Registered: ${results.serviceWorkerRegistered}`, 
          results.serviceWorkerRegistered ? logStyles.pass : logStyles.fail);
        
        if (results.serviceWorkerRegistered) {
          console.log('%cRegistered Service Workers:', logStyles.subheader);
          registrations.forEach(registration => {
            console.log('Scope:', registration.scope);
            console.log('State:', registration.active ? 'active' : registration.installing ? 'installing' : 'waiting');
          });
        }
      });
    }

    // Check if beforeinstallprompt event is supported
    window.addEventListener('beforeinstallprompt', () => {
      results.installPromptSupported = true;
      console.log(`%c✅ Install Prompt Supported: true`, logStyles.pass);
    });

    // Get manifest details
    if (results.manifest) {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      fetch(manifestLink.href)
        .then(response => response.json())
        .then(data => {
          console.log('%cManifest Details:', logStyles.subheader);
          console.log('Name:', data.name);
          console.log('Short Name:', data.short_name);
          console.log('Start URL:', data.start_url);
          console.log('Display Mode:', data.display);
          console.log('Icons:', data.icons ? data.icons.length : 0);
        })
        .catch(() => {
          console.log('%c❌ Error loading manifest', logStyles.fail);
        });
    }

    // Check meta tags
    const metaTags = {
      themeColor: !!document.querySelector('meta[name="theme-color"]'),
      viewport: !!document.querySelector('meta[name="viewport"]'),
      appleCapable: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]')
    };

    console.log('%cMeta Tags:', logStyles.subheader);
    console.log(`%c${metaTags.themeColor ? '✅' : '❌'} Theme Color: ${metaTags.themeColor}`, metaTags.themeColor ? logStyles.pass : logStyles.fail);
    console.log(`%c${metaTags.viewport ? '✅' : '❌'} Viewport: ${metaTags.viewport}`, metaTags.viewport ? logStyles.pass : logStyles.fail);
    console.log(`%c${metaTags.appleCapable ? '✅' : '❌'} Apple Mobile Web App Capable: ${metaTags.appleCapable}`, metaTags.appleCapable ? logStyles.pass : logStyles.fail);

    // Overall PWA readiness
    setTimeout(() => {
      const allRequirements = [
        results.https,
        results.serviceWorker,
        results.manifest,
        results.serviceWorkerRegistered,
        metaTags.themeColor,
        metaTags.viewport
      ];
      
      const readiness = allRequirements.filter(Boolean).length / allRequirements.length * 100;
      console.log('%cPWA Readiness:', logStyles.subheader);
      console.log(`${Math.round(readiness)}% complete`);
      
      if (readiness === 100) {
        console.log('%c✅ Promptmack is fully PWA-ready!', 'color: green; font-weight: bold; font-size: 1.2em');
      } else {
        console.log('%c⚠️ Some PWA features may not be available', 'color: orange; font-weight: bold');
      }
    }, 1000);
  }

  // Run the check after page load
  if (document.readyState === 'complete') {
    checkPWA();
  } else {
    window.addEventListener('load', checkPWA);
  }
})(); 