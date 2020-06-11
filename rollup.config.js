import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;

export default ['item'].map((name, index) => ({
	input: `src/${name}/main.js`,
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `public/build/${name}.js`
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write(`public/build/${name}.css`);
			},
			onwarn: (warning, handler) => {
				if (warning.code == 'a11y-missing-attribute' && warning.message == 'A11y: <a> element should have an href attribute') return;
				if (warning.code == 'a11y-invalid-attribute' && warning.message == "A11y: '#' is not a valid href attribute") return;
				console.log("warning:");
				console.log(warning);
				// let Rollup handle all other warnings normally
				handler(warning);
			}
		}),
		scss(),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// !production && serve(),
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		
		!production && livereload({
            watch: `public/build/${name}.*`,
            port: 3000 + index
        }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}));

function serve() {
	let started = false;

	return {
		writeBundle() {
			/*
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
			*/
		}
	};
}