import Welcome from "src/components/Welcome.svelte";

function loadApp() {
  const app = new Welcome({
    target: document.body,
    props: {},
  });
}

document.addEventListener("DOMContentLoaded", loadApp);
