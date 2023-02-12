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
                        '@action': './src/actions',
                        '@components': './src/components',
                        '@composables': './src/composables',
                        '@langs': './src/langs',
                        '@plugins': './src/plugins',
                        '@stores': './src/stores',
                        '@sockets': './src/sockets',
                    },
                },
            ],
        ],
    };
};
