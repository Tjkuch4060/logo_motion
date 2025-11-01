import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getString } from 'firebase/remote-config';
import { firebaseConfig } from '../firebase'; // Assuming your config is here

const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);

remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
    'creative_persona_description': 'Brainstorms novel ideas, names, and concepts to spark your imagination.',
    'critical_persona_description': 'Provides constructive criticism to refine your ideas and point out potential flaws.',
    'marketing_persona_description': 'Analyzes ideas for market appeal, brand potential, and audience resonance.',
    'competitor_persona_description': 'Offers strategic advice on how to differentiate your brand from the competition.',
};

export const fetchConfig = () => {
    return fetchAndActivate(remoteConfig);
};

export const getPersonaDescriptions = () => {
    return {
        creative: getString(remoteConfig, 'creative_persona_description'),
        critical: getString(remoteConfig, 'critical_persona_description'),
        marketing: getString(remoteConfig, 'marketing_persona_description'),
        competitor: getString(remoteConfig, 'competitor_persona_description'),
    };
};
