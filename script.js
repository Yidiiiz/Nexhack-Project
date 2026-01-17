// Use a video file instead (e.g. from an <input type="file">)
const visionFromFile = new RealtimeVision({
  apiUrl: 'https://cluster1.overshoot.ai/api/v0.2',
  apiKey: 'your-api-key',
  prompt: 'Describe what you see',
  source: { type: 'video', file: videoFile }
})
// Change what the AI looks for mid-stream
visionFromFile.updatePrompt('Count the number of people');