const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'bot-config.json');

const DEFAULT_CONFIG = {
  modelFile: 'model.nlp',
  serverPort: 11434,
  activeProfile: 'default',
  profiles: {
    default: {
      language: 'ar',
      threshold: 0.6,
      fallbackIntent: 'normal',
      normalizeInput: true,
      includeConfidence: false,
      intentMap: {}
    }
  }
};

function readConfigFile() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      profiles: {
        ...DEFAULT_CONFIG.profiles,
        ...(parsed.profiles || {})
      }
    };
  } catch (error) {
    console.warn('Failed to read bot-config.json, using defaults.', error.message);
    return DEFAULT_CONFIG;
  }
}

function getProfileSettings(config, requestedProfile) {
  const fallbackProfileName = config.activeProfile || 'default';
  const selectedProfileName = requestedProfile && config.profiles[requestedProfile]
    ? requestedProfile
    : fallbackProfileName;

  const baseProfile = config.profiles.default || DEFAULT_CONFIG.profiles.default;
  const selectedProfile = config.profiles[selectedProfileName] || {};

  return {
    profileName: selectedProfileName,
    modelFile: config.modelFile || DEFAULT_CONFIG.modelFile,
    language: selectedProfile.language || baseProfile.language || 'ar',
    threshold: typeof selectedProfile.threshold === 'number'
      ? selectedProfile.threshold
      : baseProfile.threshold,
    fallbackIntent: selectedProfile.fallbackIntent || baseProfile.fallbackIntent || 'normal',
    normalizeInput: typeof selectedProfile.normalizeInput === 'boolean'
      ? selectedProfile.normalizeInput
      : baseProfile.normalizeInput,
    includeConfidence: typeof selectedProfile.includeConfidence === 'boolean'
      ? selectedProfile.includeConfidence
      : baseProfile.includeConfidence,
    intentMap: {
      ...(baseProfile.intentMap || {}),
      ...(selectedProfile.intentMap || {})
    }
  };
}

function getAllConfiguredLanguages(config) {
  const profileEntries = Object.values(config.profiles || {});
  const languages = profileEntries
    .map((profile) => profile.language)
    .filter((lang) => typeof lang === 'string' && lang.trim().length > 0);

  if (languages.length === 0) {
    return ['ar'];
  }

  return [...new Set(languages)];
}

module.exports = {
  readConfigFile,
  getProfileSettings,
  getAllConfiguredLanguages,
  DEFAULT_CONFIG
};
