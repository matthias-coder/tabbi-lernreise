// Safe Web Speech API (de-DE) wrapper
export function speakText(text, options = {}) {
  const {
    enabled = true,
    lang = 'de-DE',
    rate = 0.9,
    synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  } = options;

  if (!enabled || !text || typeof text !== 'string') return false;
  if (!synth) return false;

  try {
    synth.cancel();
    const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ||
      globalThis.SpeechSynthesisUtterance;
    let utterance;
    if (UtteranceClass) {
      utterance = new UtteranceClass(text);
      utterance.lang = lang;
      utterance.rate = rate;
    } else {
      utterance = { text, lang, rate };
    }
    synth.speak(utterance);
    return true;
  } catch (err) {
    return false;
  }
}

export function stopSpeech(synth = typeof window !== 'undefined' ? window.speechSynthesis : null) {
  if (!synth) return;
  try {
    synth.cancel();
  } catch (err) {
    // Ignore error
  }
}
