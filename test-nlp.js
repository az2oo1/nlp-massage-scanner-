const { NlpManager } = require('node-nlp');
const { normalizeArabicText } = require('./preprocess');

async function main() {
  const input = process.argv.slice(2).join(' ').trim();

  if (!input) {
    console.error('Usage: node test-nlp.js "your Arabic text"');
    process.exit(1);
  }

  const manager = new NlpManager({ languages: ['ar'] });

  try {
    manager.load();
  } catch (error) {
    console.error('Failed to load model.nlp. Train the model first with: node train.js');
    process.exit(1);
  }

  const normalizedInput = normalizeArabicText(input);
  const result = await manager.process('ar', normalizedInput || input);
  const category = result.score > 0.6 ? result.intent : 'normal';

  console.log('Input:', input);
  console.log('Intent:', result.intent);
  console.log('Score:', Number(result.score || 0).toFixed(4));
  console.log('Category (threshold 0.6):', category);
}

main().catch((error) => {
  console.error('Unexpected error while testing NLP:', error.message);
  process.exit(1);
});
