module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"],
  },
  localePath: "./public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  keySeparator: ".",
  namespaceSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  fallbackLng: {
    "zh-CN": ["zh", "en"],
    "zh-TW": ["zh", "en"],
    "zh-HK": ["zh", "en"],
    "pt-BR": ["pt", "en"],
    "es-ES": ["es", "en"],
    "es-MX": ["es", "en"],
    default: ["en"],
  },
  ns: ["common", "navigation", "dashboard", "analysis"],
  defaultNS: "common",
  debug: process.env.NODE_ENV === "development",
  saveMissing: false,
  updateMissing: false,
  returnNull: false,
  returnEmptyString: false,
  returnObjects: false,
  joinArrays: false,
  overloadTranslationOptionHandler: (args) => ({
    defaultValue: args[1] && args[1].defaultValue,
  }),
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
    format: (value, format, lng) => {
      if (format === "uppercase") return value.toUpperCase()
      if (format === "lowercase") return value.toLowerCase()
      if (format === "capitalize") return value.charAt(0).toUpperCase() + value.slice(1)
      return value
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
