import './loadEnv.js';
import { migrate } from './db/repository.js';

await migrate();
console.log('[db:migrate] Done');
