const express = require('express');
const { NlpManager } = require('node-nlp');

const app = express();
app.use(express.json());

const manager = new NlpManager({ languages: ['ar'] });
manager.load(); // Loads your trained model.nlp
console.log("🧠 NLP Model loaded from disk.");

// We use the EXACT endpoint your bot is already looking for!
app.post('/api/generate', async (req, res) => {
    // Your bot currently sends the message inside a "prompt" field
    const userPrompt = req.body.prompt;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    // Process the text through your custom NLP brain
    const response = await manager.process('ar', userPrompt);
    
    // Check if the AI is confident. If not, default to 'normal'
    const category = response.score > 0.6 ? response.intent : 'normal';

    console.log(`📩 Analyzed: "${userPrompt.substring(0, 30)}..." -> [${category}] (Confidence: ${response.score})`);

    // We send it back in the exact format Ollama uses, so your bot doesn't crash!
    res.json({
        response: category 
    });
});

app.listen(11434, () => {
    console.log('🚀 Fake Ollama NLP API running on http://localhost:11434/api/generate');
});