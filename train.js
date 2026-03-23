const { NlpManager } = require('node-nlp');
const { normalizeArabicText } = require('./preprocess');

// 1. استدعاء ملف البيانات السحري مباشرة بدون الحاجة لـ JSON.parse
const dataset = require('./dataset.js'); 

const manager = new NlpManager({ languages: ['ar'], forceNER: true });

async function trainModel() {
    console.log("📥 Loading massive dataset...");
    
    // 2. إدخال البيانات للذكاء الاصطناعي
    dataset.forEach(item => {
        const normalizedText = normalizeArabicText(item.text);
        manager.addDocument('ar', normalizedText || item.text, item.intent);
    });

    console.log(`🧠 Training NLP model with ${dataset.length} examples...`);
    await manager.train();
    
    manager.save();
    console.log("✅ Training complete! Model saved as model.nlp.");
}

trainModel();