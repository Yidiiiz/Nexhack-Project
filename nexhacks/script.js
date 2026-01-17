import { RealtimeVision } from '@overshoot/sdk'
// Use a video file instead (e.g. from an <input type="file">)
async function loadVideoFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load ${url}: ${res.status}');
  const blob = await res.blob();
  return new File([blob], "test.mp4", { type: blob.type || "video/mp4" });
}

(async () => {
  const video = await loadVideoFile("/videos/videoplayback.mp4");
  const visionFromFile = new RealtimeVision({
    apiUrl: 'https://cluster1.overshoot.ai/api/v0.2',
    apiKey: '',
    prompt: 'Describe what you see',
    source: { type: 'video', file: video },
    onResult: (result) => {
      console.log(result.result)                    // the AI's response
      console.log(result.inference_latency_ms)      // model time (ms)
      console.log(result.total_latency_ms)          // end-to-end time (ms)
    }
  })

  await visionFromFile.start();
})();

// Change what the AI looks for mid-stream
// visionFromFile.updatePrompt('Count the number of people');



// const vision = new RealtimeVision({
//   apiUrl: 'https://cluster1.overshoot.ai/api/v0.2',
//   apiKey: 'your-api-key',
//   prompt: 'Count the people in the frame',
//   outputSchema: {
//     type: 'object',
//     properties: {
//       count: { type: 'number' }
//     }
//   },
//   onResult: (result) => {
//     const data = JSON.parse(result.result)
//     console.log('People count:', data.count)
//   }
// })