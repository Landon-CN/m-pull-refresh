import babel from 'rollup-plugin-babel';

export default {
  input: 'src/refresh.js',
  output: {
    file: 'dist/refresh.es.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
