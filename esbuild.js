import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import rm from './env/rm.js';
import log from './env/log.js';
import meta from './env/meta.js';
import pkg from './package.json' with { type: 'json' };

const DEV = process.argv.includes('--dev');

const svelteOptions = {
  compilerOptions: {
    css: 'external',
    cssHash: ({ hash, css }) => {
      return `${pkg.name}-${hash(css)}`;
    },
    runes: true,
    modernAst: true
  }
};

const buildOptions = {
  bundle: true,
  minify: !DEV,
  sourcemap: DEV,
  entryPoints: ['src/app.ts'],
  outdir: 'public/build',
  format: 'esm',
  loader: { '.svg': 'text' },
  plugins: [svelte(svelteOptions), log],
  legalComments: 'none',
  logLevel: 'info',
  metafile: !DEV,
  conditions: ['development', 'production']
};

await rm(['public/build']);

if (DEV) {
  const ctx = await context(buildOptions);

  await ctx.watch();
  await ctx.serve({
    host: '0.0.0.0',
    servedir: 'public'
    // cors: {
    //   origin: 'https://somafm.com'
    // }
    // certfile:'localhost.crt',
    // keyfile: 'localhost.key'
  });

  process.on('SIGTERM', ctx.dispose);
  process.on('exit', ctx.dispose);
} else {
  await meta(await build(buildOptions));
}
