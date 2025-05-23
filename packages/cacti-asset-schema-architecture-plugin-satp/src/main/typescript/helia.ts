import { createHelia } from 'helia';

createHelia()
  .then(() => {
    console.info('Helia is running');
  });