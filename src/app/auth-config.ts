import {
  BrowserCacheLocation,
  Configuration,
  LogLevel
} from '@azure/msal-browser';

export const tenantId =
  '0e309e18-e3ab-4256-8fcf-5608cfe52cbe';

export const frontendClientId =
  '53533e18-5679-47ff-bb6d-6b2178217ae6';

export const authority =
  `https://login.microsoftonline.com/${tenantId}`;

export const redirectUri =
  'http://localhost:4200';

export const apiScope =
  'api://c96eeade-7cad-46b0-979f-ca4e30aa8889/access_as_user';

export const msalConfig: Configuration = {
  auth: {
    clientId: frontendClientId,
    authority: authority,
    redirectUri: redirectUri,
    postLogoutRedirectUri: redirectUri
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
  },
  system: {
    allowPlatformBroker: false,
    loggerOptions: {
      loggerCallback: (
        logLevel: LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }

        console.log(`[MSAL ${LogLevel[logLevel]}] ${message}`);
      },
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false
    }
  }
};

export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    apiScope
  ]
};