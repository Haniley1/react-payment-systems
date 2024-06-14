document.addEventListener("DOMContentLoaded", function(event) { 

  let authUserEmail;

  // auth code for Keycloak
  /*
  const passportBaseURL = `https://passport.dreamcatchme.ru`;

  // append keycloak script to page
  const scriptEl = document.createElement('script');
  scriptEl.type = 'text/javascript';
  scriptEl.src = `${passportBaseURL}/auth/js/keycloak.js`;
  document.body.appendChild(scriptEl);

  // await loading script
  scriptEl.onload = async () => {

    const keycloak = Keycloak({ 
      "realm": "dreamcatchme",
      "auth-server-url": `${passportBaseURL}/auth/`,
      "ssl-required": "external",
      "resource": "dreamcatchme",
      "clientId": "deva-crm",
      "public-client": true,
      "verify-token-audience": true,
      "use-resource-role-mappings": true,
      "confidential-port": 0,
      "enable-cors": true,
    });

    const authFailed =  () => {
      console.log('Failed to define auth state');
    };
    const authCompleted = (isAuthentificated) => {
      console.log(`User isAuthentificated=${isAuthentificated}`);
      if (isAuthentificated && keycloak.idTokenParsed?.email) {
        authUserEmail = keycloak.idTokenParsed.email;
      }
    }

    await keycloak.init({ 
        onLoad: 'check-sso', // allow to check silent auth status
        enableLogging: true,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      })
      .success(authCompleted)
      .error(authFailed);
    */

    // take params from url (including utm-marks and so on)
    const urlMarks = Object.fromEntries((document.location.search.match(/(utm_).+?=[^&]*/g) || []).map(n => n.split('=')));
    const forms = document.querySelectorAll('form.deva-form');
    forms.forEach(form => {
      // insert email of auth user
      if (authUserEmail) {
        const emailInput = form.querySelector('input[name="email"]');
        emailInput.value = authUserEmail;
        emailInput.disabled = true;
      }

      // insert utm marks from url as hidden fields to form
      for (const [key, value] of Object.entries(urlMarks)) {
        const utmInput = document.createElement('input');
        utmInput.hidden = true;
        utmInput.name = key;
        utmInput.value = value;
        form.appendChild(utmInput);
      }

    });


    // add to all outer links (target="_top")
    var links = document.querySelectorAll('a[href*="http"]:not([target="_blank"]):not([target="blank"])');
    links.forEach(link => {
      link.target = "_top";
    });

  // };

});