import * as esbuild from 'esbuild';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env o credenciales.env
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else if (fs.existsSync('src/credenciales/credenciales.env')) {
  dotenv.config({ path: 'src/credenciales/credenciales.env' });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.supabase_url || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.supabase_key || '';

const isWatch = process.argv.includes('--watch');

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'iife',
  globalName: 'App',
  sourcemap: true,
  minify: false,
  target: ['es2020'],
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
    'process.env.SUPABASE_KEY': JSON.stringify(supabaseKey),
    'process.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET || '')
  }
};

async function run() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('⚡ Observando cambios con esbuild (modo watch)...');
    } else {
      await esbuild.build(buildOptions);
      console.log('✅ Compilación y empaquetado exitoso en dist/bundle.js');
    }
  } catch (error) {
    console.error('❌ Error durante el empaquetado:', error);
    process.exit(1);
  }
}

run();
