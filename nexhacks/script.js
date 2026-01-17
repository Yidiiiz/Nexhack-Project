import { RealtimeVision } from '@overshoot/sdk'

let vision = null;
let videoDuration = 0;

// Get video duration from a File object
function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration * 1000); // Convert to milliseconds
    };
    video.src = URL.createObjectURL(file);
  });
}

// Use a video file instead (e.g. from an <input type="file">)
async function loadVideoFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load ${url}: ${res.status}');
  const blob = await res.blob();
  return new File([blob], "test.mp4", { type: blob.type || "video/mp4" });
}

(async () => {
  const video = await loadVideoFile("/videos/videoplayback.mp4");
  
  // Get video duration
  videoDuration = await getVideoDuration(video);
  console.log(`Video duration: ${(videoDuration / 1000).toFixed(1)} seconds`);

  vision = new RealtimeVision({
    apiUrl: 'https://cluster1.overshoot.ai/api/v0.2',
    apiKey: 'ovs_92ca80c5d500be12729bbb47e3da786a',
    prompt: 'Tell me when there is a collision.',
    source: { type: 'video', file: video },
    onResult: (result) => {
      console.log(result.result);  // AI response
      console.log(`Inference: ${result.inference_latency_ms}ms | Total: ${result.total_latency_ms}ms`);
    },
    onEnd: async () => {
      console.log('Video ended - stopping vision');
      await vision.stop();
    }
  })

  await vision.start();

  // Auto-stop after video duration
  setTimeout(async () => {
    if (vision) {
      console.log('Video duration reached - stopping vision');
      await vision.stop();
    }
  }, videoDuration);
})();

// Stop button handler
document.getElementById('stopBtn').addEventListener('click', async () => {
  if (vision) {
    await vision.stop();
    console.log('Vision stopped');
  }
});

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