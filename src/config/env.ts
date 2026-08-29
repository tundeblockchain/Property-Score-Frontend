const DEFAULT_API_BASE_URL =
  'https://3w7s95cy97.execute-api.eu-west-2.amazonaws.com/prod';
const DEFAULT_WS_URL =
  'wss://f4o048p9c7.execute-api.eu-west-2.amazonaws.com/prod';

function readEnv(name: keyof ImportMetaEnv, fallback = ''): string {
  const value = import.meta.env[name];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function requiredFirebase(name: keyof ImportMetaEnv): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill in Firebase web config.`,
    );
  }
  return value;
}

export const env = {
  apiBaseUrl: readEnv('VITE_API_BASE_URL', DEFAULT_API_BASE_URL),
  wsUrl: readEnv('VITE_WS_URL', DEFAULT_WS_URL),
  metaPixelId: readEnv('VITE_META_PIXEL_ID'),
  metaDomainVerification: readEnv('VITE_META_DOMAIN_VERIFICATION'),
  gaMeasurementId: readEnv('VITE_GA_MEASUREMENT_ID'),
  get firebase() {
    return {
      apiKey: requiredFirebase('VITE_FIREBASE_API_KEY'),
      authDomain: requiredFirebase('VITE_FIREBASE_AUTH_DOMAIN'),
      projectId: requiredFirebase('VITE_FIREBASE_PROJECT_ID'),
      appId: requiredFirebase('VITE_FIREBASE_APP_ID'),
    };
  },
} as const;
