// frontend/craco.config.js
const path = require("path");
const webpack = require("webpack"); // <--- PENTING: Wajib ada untuk fix React is not defined

require("dotenv").config();

const isDevServer = process.env.NODE_ENV !== "production";

const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  // 1. KITA PAKSA FITUR INI MATI AGAR TIDAK ERROR "traverse"
  enableVisualEdits: false, 
};

// Health check setup (biarkan standar)
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  try {
    WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
    setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
    healthPluginInstance = new WebpackHealthPlugin();
  } catch (e) {
    console.warn("Skipping health check plugins...");
  }
}

const webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Matikan devtool di production agar build lebih cepat & aman
      if (!isDevServer) {
        webpackConfig.devtool = false;
      }

      // 2. SOLUSI ERROR "React is not defined"
      // Plugin ini otomatis menyuntikkan 'import React' ke semua file
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          React: "react",
        }),
      ];

      // Ignore patterns untuk watch options
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/build/**',
          '**/public/**',
        ],
      };

      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

// 3. SOLUSI ERROR "jsxDEV is not a function"
// Kita paksa Babel pakai mode Classic
webpackConfig.babel = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "classic", 
      },
    ],
  ],
  plugins: [], // Kosongkan plugin visual-edits
  loaderOptions: (babelLoaderOptions) => {
    // Matikan React Refresh jika bikin crash
    if (process.env.FAST_REFRESH === "false" && babelLoaderOptions.plugins) {
      babelLoaderOptions.plugins = babelLoaderOptions.plugins.filter(
        (p) => !p.toString().includes("react-refresh")
      );
    }
    return babelLoaderOptions;
  },
};

webpackConfig.devServer = (devServerConfig) => {
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }
      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }
  return devServerConfig;
};

module.exports = webpackConfig;
