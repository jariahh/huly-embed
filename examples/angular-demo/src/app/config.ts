import type { HulyEmbedConfig } from '@huly-embed/core';

export const hulyConfig: HulyEmbedConfig = {
  // Huly platform URL
  hulyUrl: 'https://huly.unveiledsoftwaresolutions.com',
  // Default project identifier
  defaultProject: 'SUPPO',
  // Backend endpoint that returns embed tokens
  tokenEndpoint: 'http://localhost:3000/api/huly/embed-token',
  // Origins allowed for postMessage communication
  allowedOrigins: ['https://huly.unveiledsoftwaresolutions.com'],
  // Seconds before token expiry to trigger refresh
  tokenRefreshBuffer: 60,
};
