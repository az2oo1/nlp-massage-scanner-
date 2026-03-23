const { NlpManager } = require('node-nlp');
const { normalizeArabicText } = require('./preprocess');
const { readConfigFile, getProfileSettings } = require('./config');

// 1. استدعاء ملف البيانات السحري مباشرة بدون الحاجة لـ JSON.parse
const dataset = require('./dataset.js'); 

const botConfig = readConfigFile();
const trainingSettings = getProfileSettings(botConfig);

const manager = new NlpManager({ languages: [trainingSettings.language], forceNER: true });

async function trainModel() {
    console.log("📥 Loading massive dataset...");
    
    // 2. إدخال البيانات للذكاء الاصطناعي
    dataset.forEach(item => {
        const normalizedText = trainingSettings.normalizeInput ? normalizeArabicText(item.text) : item.text;
        manager.addDocument(trainingSettings.language, normalizedText || item.text, item.intent);
    });

    console.log(`🧠 Training NLP model with ${dataset.length} examples...`);
    await manager.train();
    
    manager.save(trainingSettings.modelFile);
    console.log(`✅ Training complete! Model saved as ${trainingSettings.modelFile} (profile: ${trainingSettings.profileName}).`);
}

trainModel();