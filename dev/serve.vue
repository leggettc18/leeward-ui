<script lang="ts">
import LeButton from "@/lib-components/le-button.vue";
import LeApp from "@/lib-components/le-app.vue";
import { defineComponent } from "vue";
// Uncomment import and local "components" registration if library is not registered globally.
// import { LeewayUiSample } from '@/entry.esm';

export default defineComponent({
  components: { LeButton, LeApp },
  name: "ServeDev",
  // components: {
  //  LeewayUiSample,
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
    <le-app>
      <le-button @click="counter++">Add</le-button>
      <span>{{counter}}</span>
    </le-app>
  </div>
</template>
