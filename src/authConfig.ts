/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        clientId: '15c1c3ef-90d5-4baa-9d92-4c063a1186bf', // This is the ONLY mandatory field that you need to supply. //'15c1c3ef-90d5-4baa-9d92-4c063a1186bf', //
        //authority:  '9678d2de-0c68-47d5-80f3-d1b43b726b0e',
        //clientId: 'f9c4f176-9e7f-424a-b417-86da612252b8', //'15c1c3ef-90d5-4baa-9d92-4c063a1186bf', // This is the ONLY mandatory field that you need to supply.
        //authority: 'https://TrialTenant1qGo77oT.ciamlogin.com', ///9678d2de-0c68-47d5-80f3-d1b43b726b0e', // Replace the placeholder with your tenant subdomain

        //authority: 'https://login.microsoftonline.com/15c1c3ef-90d5-4baa-9d92-4c063a1186bf', // Replace the placeholder with your tenant info
      
        //clientId: '2f4006c5-c4ea-4165-846f-914b5b75685b', //'f9c4f176-9e7f-424a-b417-86da612252b8', // This is the ONLY mandatory field that you need to supply.
        //authority:  '9678d2de-0c68-47d5-80f3-d1b43b726b0e', // Replace the placeholder with your tenant subdomain 'https://TrialTenant1qGo77oT.ciamlogin.com' 'https://login.microsoftonline.com/9678d2de-0c68-47d5-80f3-d1b43b726b0e',
        authority:  'https://login.microsoftonline.com/9678d2de-0c68-47d5-80f3-d1b43b726b0e', //  your tenant subdomain ,
        redirectUri: 'http://localhost:5173/src/', // You must register this URI on Microsoft Entra admin center/App Registration. Defaults to window.location.origin // http://localhost:5173/src
        postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            /**
             * Below you can configure MSAL.js logs. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/msal-logging-js
             */
            loggerCallback: (level: unknown, message: unknown, containsPii: unknown) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
    KnowledgeAPI: {
        endpointCategoryRow: `${import.meta.env.VITE_KNOWLEDGE_LIB_API_URL}/CategoryRow`,
        endpointQuestion: `${import.meta.env.VITE_KNOWLEDGE_LIB_API_URL}/Question`,
        endpointHistory: `${import.meta.env.VITE_KNOWLEDGE_LIB_API_URL}/History`,
        endpointHistoryFilter: `${import.meta.env.VITE_KNOWLEDGE_LIB_API_URL}/HistoryFilter`,
        scopes: {
            read: ['api://91385bcd-f531-4b1c-8b3d-2105439f0a8a/ToDoList.Read'],
            write: ['api://91385bcd-f531-4b1c-8b3d-2105439f0a8a/ToDoList.ReadWrite']
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [...protectedResources.KnowledgeAPI.scopes.read, ...protectedResources.KnowledgeAPI.scopes.write],
};
