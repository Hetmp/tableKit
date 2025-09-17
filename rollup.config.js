import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tablekit.js',
      format: 'umd',
      name: 'TableKit',
      globals: { jquery: '$' }
    },
    {
      file: 'dist/tablekit.esm.js',
      format: 'esm'
    }
  ],
  external: ['jquery'],
  plugins: [typescript()]
};
