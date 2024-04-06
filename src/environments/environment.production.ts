export const environment = {
    production: true,
    assets: 'https://pruebasassets.portaloas.udistrital.edu.co/',
    apiUrl: 'http://localhost:4202/',
    TOKEN: {
      AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
      CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
      RESPONSE_TYPE: 'id_token token',
      SCOPE: 'openid email role documento',
      REDIRECT_URL: 'http://localhost:4200/',
      SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
      SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
      AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
    },
    SGA_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/sga_mid/v1/',
};