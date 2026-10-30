const VERSION = "v1";
const CACHE = "handdemo-" + VERSION;
const MODEL_REMOTE = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const CORE = [
  "./", "./index.html", "./manifest.webmanifest", "./icon.svg",
  "./mp/vision_bundle.mjs",
  "./mp/wasm/vision_wasm_internal.js", "./mp/wasm/vision_wasm_internal.wasm",
  "./mp/wasm/vision_wasm_nosimd_internal.js", "./mp/wasm/vision_wasm_nosimd_internal.wasm",
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    // modello: locale se presente, altrimenti dal CDN Google (best effort)
    try {
      const r = await fetch("./mp/hand_landmarker.task");
      if (r.ok) await c.put("./mp/hand_landmarker.task", r);
      else throw 0;
    } catch (_) {
      try { const r = await fetch(MODEL_REMOTE); if (r.ok) await c.put(MODEL_REMOTE, r); } catch (_) {}
    }
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" && req.method !== "HEAD") return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, { ignoreSearch: true, ignoreMethod: true });
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r.ok && req.method === "GET" && (req.url === MODEL_REMOTE || new URL(req.url).origin === location.origin))
        c.put(req, r.clone());
      return r;
    } catch (err) {
      return new Response("offline", { status: 503 });
    }
  })());
});
