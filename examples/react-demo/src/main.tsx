import { createRoot } from 'react-dom/client';
import { HulyEmbedProvider } from '@huly-embed/react';
import { hulyConfig } from './config';
import { App } from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <HulyEmbedProvider config={hulyConfig}>
    <App />
  </HulyEmbedProvider>
);
