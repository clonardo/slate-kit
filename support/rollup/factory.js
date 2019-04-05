import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import { startCase } from "lodash";
import analyze from "rollup-plugin-analyzer";
import { eslint } from "rollup-plugin-eslint";
import fs from "fs";
import path from "path";

/**
 * Return a Rollup configuration for a `pkg` with `env` and `target`.
 *
 * @param {Object} pkg
 * @param {String} env
 * @param {String} format
 * @return {Object}
 */

function configure(pkg, location, env, target) {
  const isProd = env === "production";
  const isUmd = target === "umd";
  const isModule = target === "module";
  const input = fs.existsSync(`${location}/src/index.js`)
    ? `${location}/src/index.js`
    : `${location}/src/index.ts`;
  const watch = {
    chokidar: true,
    include: `${location}/src/**`,
    exclude: `${location}/node_modules/**`
  };

  const isTypescript = /\.(ts|tsx)$/i.test(input);

  const deps = []
    .concat(pkg.dependencies ? Object.keys(pkg.dependencies) : [])
    .concat(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []);

  const plugins = [
    // Allow Rollup to resolve modules from `node_modules`, since it only
    // resolves local modules by default.
    resolve({
      browser: true,
      preferBuiltins: true
    }),

    eslint({}),

    // Allow Rollup to resolve CommonJS modules, since it only resolves ES2015
    // modules by default.
    isUmd &&
      commonjs({
        exclude: [`${location}/src/**`],
        // HACK: Sometimes the CommonJS plugin can't identify named exports, so
        // we have to manually specify named exports here for them to work.
        // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
        namedExports: {
          esrever: ["reverse"],
          immutable: [
            "List",
            "Map",
            "Record",
            "OrderedSet",
            "Set",
            "Stack",
            "is"
          ],
          "fbjs/lib/shallowEqual": ["shallowEqual"],
          react: ["createElement", "Component"],
          "react-dom": ["findDOMNode"],
          "react-dom/server": ["renderToStaticMarkup"]
        }
      }),

    // Convert JSON imports to ES6 modules.
    json(),

    // Replace `process.env.NODE_ENV` with its value, which enables some modules
    // like React and Slate to use their production variant.
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    }),

    isTypescript &&
      typescript({
        tsconfig: `${location}/tsconfig.rollup.json`,
        typescript: require("typescript"),
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            rootDir: path.resolve(location, "src")
          },
          include: [path.resolve(location, "src")]
        }
      }),

    // Use Babel to transpile the result, limiting it to the source code.
    !isTypescript &&
      babel({
        include: [`${location}/src/**`],
        plugins: ["@babel/external-helpers"]
      }),

    // Register Node.js globals for browserify compatibility.
    globals(),
    analyze({
      writeTo: string => {
        fs.writeFileSync(`tmp/stats/${pkg.name}-${target}-${env}.txt`, string);
      }
    }),

    // Only minify the output in production, since it is very slow. And only
    // for UMD builds, since modules will be bundled by the consumer.
    isUmd &&
      isProd &&
      terser({
        parse: {
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true
        }
      })
    // progress()
  ].filter(Boolean);

  if (isUmd) {
    return {
      watch,
      plugins,
      input,
      output: {
        format: "umd",
        file: `${location}/${isProd ? pkg.umdMin : pkg.umd}`,
        exports: "named",
        name: startCase(pkg.name)
          .replace(/@vericus/g, "")
          .replace(/ /g, ""),
        globals: pkg.umdGlobals,
        sourcemap: true
      },
      external: Object.keys(pkg.umdGlobals || {})
    };
  }

  if (isModule) {
    return {
      watch,
      plugins,
      input,
      output: [
        {
          file: `${location}/${pkg.module}`,
          format: "es",
          sourcemap: true
        },
        {
          file: `${location}/${pkg.main}`,
          format: "cjs",
          exports: "named",
          sourcemap: true
        }
      ],
      // We need to explicitly state which modules are external, meaning that
      // they are present at runtime. In the case of non-UMD configs, this means
      // all non-Slate-kit packages.
      external: id => !!deps.find(dep => dep === id || id.startsWith(`${dep}/`))
    };
  }
  return undefined;
}

/**
 * Return a Rollup configuration for a `pkg`.
 *
 * @return {Array}
 */

function factory(pkg, location) {
  const isProd = process.env.NODE_ENV === "production";
  return [
    configure(pkg, location, "development", "module"),
    isProd && configure(pkg, location, "development", "umd"),
    isProd && configure(pkg, location, "production", "umd")
  ].filter(Boolean);
}

/**
 * Export.
 *
 * @type {Function}
 */

export default factory;
