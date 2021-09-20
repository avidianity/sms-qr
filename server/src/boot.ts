import dotenv from 'dotenv';
import { resolve } from 'path';
import expand from 'dotenv-expand';

const path = resolve(__dirname, '../');

const env = dotenv.config({ path });

expand(env);
