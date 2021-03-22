<script lang="ts">
import { defineComponent } from "vue";
// Uncomment import and local "components" registration if library is not registered globally.
// import { LeewardUiSample } from '@/entry.esm';

export default defineComponent({
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
  <le-app block>
    <le-flex>
      <le-button lg @click="counter++">Add</le-button>
      {{counter}}
    </le-flex>
  </le-app>
</template>
