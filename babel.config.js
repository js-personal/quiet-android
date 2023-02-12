module.exports = function (api) {
    api.cache(false);
    return {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: [
            [
                'module-resolver',
                {
                    extensions: ['.js', '.ts', '.tsx', '.android.tsx', '.ios.tsx', '.json'],
                    root: ['./src/'],
                    alias: {
                        // This needs to be mirrored in tsconfig.json
                        '@': './src',
                        '@assets': './src/assets',
                        '@actions': './src/actions',
                        '@activities': './src/activities',
                        '@config': './src/app.config.ts',
                        '@components': './src/components',
                        '@composables': './src/composables',
                        '@memory': './src/app.memory.ts',
                        '@langs': './src/langs',
                        '@plugins': './src/plugins',
                        '@stores': './src/stores',
                        '@sockets': './src/sockets',
                        '@helpers': './src/app.helpers.ts',
                        '@helpers-dev': './src/app.helpers.dev.ts',
                    },
                },
            ],
        ],
    };
};
