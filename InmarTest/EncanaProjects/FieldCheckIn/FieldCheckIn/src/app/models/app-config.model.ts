export interface IAppConfig {
    env: {
        name: string;
    };
    appInsights: {
        instrumentationKey: string;
    };
    logging: {
        console: boolean;
        appInsights: boolean;
    };
    aad: {
        requireAuth: boolean;
        tenant: string;
        clientId: string;
        endpoints: {
            "https://graph.microsoft.com": string;
            webApiUri: string;
        };
        cacheLocation: string;
    };
    apiServer: {
        metadata: string;
        rules: string;
    };
}