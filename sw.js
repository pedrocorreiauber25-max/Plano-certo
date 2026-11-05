const CACHE="plano-certo-v4";
const FILES=["./","./index.html","./manifest.json","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(a=>Promise.all(a.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(e.request.mode==="navigate"||url.pathname.endsWith("/index.html")){
    e.respondWith(fetch(e.request).then(v=>{const copy=v.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return v;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(v=>{const copy=v.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return v;})));
});