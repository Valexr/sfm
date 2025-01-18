import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import rm from './env/rm.js';
import log from './env/log.js';
import meta from './env/meta.js';
import proxy from './env/proxy.js';
import pkg from './package.json' with {type: 'json'};

const DEV = process.argv.includes('--dev');
const SPA = process.argv.includes('--spa');

const svelteOptions = {
    compilerOptions: {
        css: 'external',
        cssHash: ({ css, filename, name, hash }) => {
            return `${pkg.name}-${hash(css)}`;
        },
        runes: true,
        immutable: true,
        modernAst: true
    },
    preprocess: [
        sveltePreprocess({
            sourceMap: DEV,
            typescript: true,
        }),
    ]
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
    inject: DEV ? ['./env/lr.js'] : [],
    legalComments: 'none',
    logLevel: 'info',
    metafile: !DEV,
    conditions: ['development', 'production']
};

await rm(['public/build']);

if (DEV) {
    const ctx = await context(buildOptions);

    await ctx.watch();
    await ctx.serve({ servedir: 'public' });

    SPA && proxy().listen(8080);

    process.on('SIGTERM', ctx.dispose);
    process.on('exit', ctx.dispose);
} else {
    await meta(await build(buildOptions));
}