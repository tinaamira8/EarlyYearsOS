// Preserve links issued before the homepage became public.
const callbackQuery = new URLSearchParams(location.search);
if (location.pathname === '/' && (callbackQuery.has('payment_success') || callbackQuery.has('code') || /(?:access_token|type=recovery)=?/.test(location.hash))) {
  location.replace('/login' + location.search + location.hash);
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => registration?.update()).catch(() => {});
}
