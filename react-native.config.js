module.exports = {
  dependencies: {
    appcenter: {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    'appcenter-analytics': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    'appcenter-crashes': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['./src/assets/fonts/'], // stays the same
};
