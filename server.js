const express = require('express');
const { NlpManager } = require('node-nlp');
const { normalizeArabicText } = require('./preprocess');
const { readConfigFile, getProfileSettings, getAllConfiguredLanguages } = require('./config');

const botConfig = readConfigFile();
const manager = new NlpManager({ languages: getAllConfiguredLanguages(botConfig) });
const startupSettings = getProfileSettings(botConfig);

manager.load(startupSettings.modelFile);
console.log(`🧠 NLP Model loaded from disk (${startupSettings.modelFile}). Active profile: ${startupSettings.profileName}`);

function parseCliArgs(argv) {
    const args = [...argv];
    let profile;
    const promptParts = [];
    let promptModeEnabled = false;

    for (let i = 0; i < args.length; i += 1) {
        const current = args[i];

        if (current === '--profile') {
            if (i + 1 < args.length) {
                profile = args[i + 1];
                i += 1;
            }
            continue;
        }

        if (current === '--prompt') {
            promptModeEnabled = true;
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                promptParts.push(args[i + 1]);
                i += 1;
            }
            continue;
        }

        promptParts.push(current);
    }

    const prompt = promptParts.join(' ').trim();

    return {
        prompt: prompt.length > 0 ? prompt : undefined,
        profile,
        promptModeEnabled
    };
}

async function classifyPrompt(userPrompt, requestedProfile) {
    const settings = getProfileSettings(botConfig, requestedProfile);
    const normalizedPrompt = settings.normalizeInput ? normalizeArabicText(userPrompt) : userPrompt;
    const response = await manager.process(settings.language, normalizedPrompt || userPrompt);
    const mappedIntent = settings.intentMap[response.intent] || response.intent;
    const category = response.score > settings.threshold ? mappedIntent : settings.fallbackIntent;

    const payload = {
        response: category
    };

    if (settings.includeConfidence) {
        payload.meta = {
            profile: settings.profileName,
            intent: response.intent,
            score: response.score,
            threshold: settings.threshold,
            language: settings.language
        };
    }

    return {
        payload,
        settings,
        response
    };
}

function startApiServer() {
    const app = express();
    app.use(express.json());

    // We use the EXACT endpoint your bot is already looking for!
    app.post('/api/generate', async (req, res) => {
        // Your bot currently sends the message inside a "prompt" field
        if (!req.body) {
            return res.status(400).json({ error: "Request body is empty. Ensure Content-Type is application/json" });
        }

        const userPrompt = req.body.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "No prompt provided" });
        }

        try {
            const requestedProfile = typeof req.body.profile === 'string' ? req.body.profile : undefined;
            const { payload, settings, response } = await classifyPrompt(userPrompt, requestedProfile);

            console.log(`📩 [${settings.profileName}] Analyzed: "${userPrompt.substring(0, 30)}..." -> [${payload.response}] (Confidence: ${response.score})`);
            res.json(payload);
        } catch (error) {
            res.status(500).json({ error: `Failed to process prompt: ${error.message}` });
        }
    });

    const port = Number(process.env.PORT || botConfig.serverPort || 11434);
    app.listen(port, () => {
        console.log(`🚀 Fake Ollama NLP API running on http://localhost:${port}/api/generate`);
    });
}

async function runCliPrompt(prompt, requestedProfile) {
    const { payload, settings, response } = await classifyPrompt(prompt, requestedProfile);
    console.log(`📩 [${settings.profileName}] Intent: ${response.intent} | Score: ${response.score}`);
    console.log(JSON.stringify(payload, null, 2));
}

async function main() {
    const cli = parseCliArgs(process.argv.slice(2));

    if (cli.promptModeEnabled || cli.prompt) {
        if (!cli.prompt) {
            console.error('Missing prompt text. Usage: node server.js --prompt "your text" [--profile strict]');
            process.exit(1);
        }
        await runCliPrompt(cli.prompt, cli.profile);
        return;
    }

    startApiServer();
}

main().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});