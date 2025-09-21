// frontend/public/sw.js
// 기존 top-level skipWaiting/claim 제거하고 이벤트에서 처리
self.addEventListener("install", () => self.skipWaiting && self.skipWaiting())
self.addEventListener("activate", (event) => {
  if (self.clients?.claim) event.waitUntil(self.clients.claim())
})

// 푸시/클릭 핸들러는 그대로
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "공지"
  const body = data.body || ""
  const url = data.url || "/"
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url }
    })
  )
})
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/"
  event.waitUntil(self.clients.openWindow(url))
})