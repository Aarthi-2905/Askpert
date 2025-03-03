import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock `import.meta.env`
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_HOST: 'http://localhost', // Mock value
        VITE_PORT: '3000', // Mock value
      },
    },
  },
  writable: true,
});
