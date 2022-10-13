<script lang="ts">
  import Code from "./icons/Code.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Github from "./icons/Github.svelte";
  import Carousel from "svelte-carousel";

  let carousel: Carousel;
</script>

<svelte:head>
  <link rel="stylesheet" href="../../../css/index.css" />
</svelte:head>

<div>
  <section class="antialiased bg-gray-100 text-gray-600 h-screen px-4">
    <div class="pt-32">
      <div
        class="w-full max-w-xl mx-auto bg-white rounded-sm border border-gray-200"
      >
        <div class="flex justify-center">
          <img
            class="w-60"
            src="../../../images/slashgo_header.png"
            alt="SlashGo Header"
          />
        </div>

        <div class="p-2 text-center text-sm">
          Welcome to <span class="font-bold">SlashGo</span>!
          <br />
        </div>
        <div>
          <Carousel bind:this={carousel} infinite={false} swiping={false}>
            <div class="flex justify-center">
              <div class="w-full text-center">
                To get started, pin this browser extension...
              </div>

              <img
                src="../../../images/pin_app.png"
                alt="Pin SlashGo Extension"
              />
            </div>
            <div class="flex justify-center">
              <div class="w-full text-center">
                .. Login with your SlashGo account ..
              </div>
              <img
                src="../../../images/login.png"
                alt="Pin SlashGo Extension"
              />
            </div>
            <div class="flex justify-center">
              <div class="w-full text-center">
                .. <span class="font-bold">* Boom *</span> We're done! <br />
                <br />
                Go to <span class="font-bold">go/code</span> to test!

                <div class="text-xs italic pt-2 text-slate-400">
                  <span class="font-bold">Note:</span> Your org may have set a custom
                  SlashGo trigger instead of "go"
                </div>
              </div>
              <img
                src="../../../images/navigate_go.png"
                alt="Start using Shortlinks!"
              />
            </div>
            <div class="flex justify-center">
              <div class="w-full text-center">
                ... Create <span class="font-bold">SlashGo</span> shortlinks.
                <br /><br />
                Click <span class="font-bold">View Links</span> to view currently
                configured shortlinks
              </div>
              <img
                src="../../../images/popup_sample.png"
                alt="Create and view  your shortlinks!"
              />
            </div>
          </Carousel>
        </div>

        <div class="flex justify-center  text-lg">
          <a
            class="p-2 text-gray-400 hover:text-slate-900"
            href="https://slashgo.link"
            ><Code size="24" fill="currentColor" /></a
          >
          <a
            class="p-2 text-gray-400 hover:text-violet-900"
            href="https://github.com/Slash-Go"
            ><Github size="24" fill="currentColor" /></a
          >
          <a
            class="p-2 text-gray-400 hover:text-sky-400"
            href="https://twitter.com/SlashGoApp"
            ><Twitter size="24" fill="currentColor" /></a
          >
        </div>
      </div>
    </div>
  </section>
</div>

<div />
