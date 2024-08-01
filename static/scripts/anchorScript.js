// Fix for anchor links taking you too far down the page
window.addEventListener("hashchange", function () {
  window.scrollTo(window.scrollX, window.scrollY - 100);
});