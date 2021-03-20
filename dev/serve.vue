<script lang="ts">
import LeButton from "@/lib-components/le-button.vue";
import LeApp from "@/lib-components/le-app.vue";
import { defineComponent } from "vue";
// Uncomment import and local "components" registration if library is not registered globally.
// import { LeewardUiSample } from '@/entry.esm';

export default defineComponent({
  components: { LeButton, LeApp },
  name: "ServeDev",
  // components: {
  //  LeewardUiSample,
  // }
  data() {
    return {
      counter: 1,
    };
  },
});
</script>

<template>
  <div id="app">
    <le-app block>
      <le-button xl @click="counter++">Add</le-button>
      <span>{{counter}}</span>
    </le-app>
  </div>
</template>
