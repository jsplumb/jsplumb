module.exports = function (api) {
    api.cache(true);

    const presets = [
        [ "@babel/env",
            {
                "modules": false
            }
        ],
        "@babel/preset-typescript"
    ];
    const plugins = [
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ];

    return {
        presets,
        plugins
    };
}
