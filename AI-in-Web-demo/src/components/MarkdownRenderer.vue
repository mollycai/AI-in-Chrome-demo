<template>
	<div class="markdown-content" v-html="htmlContent"></div>
</template>

<script setup>
import { onMounted, defineProps, watch, ref } from "vue";
import md from "@/utils/md.js";
import { handleCopy, debounce } from "@/utils/utils.js";

const props = defineProps({
  markdownStr: String
})

const htmlContent = ref('');
let incrementalContent = '';

// 使用侦听属性处理增量内容
watch(() => props.markdownStr, (newVal) => {
  incrementalContent = newVal;
  htmlContent.value = md.render(incrementalContent);
}, { immediate: true });

onMounted(() => {
  document.querySelector(".markdown-content").addEventListener("click", (e) => {
    if (e.target.closest(".code-copy")) {
      debounce(handleCopy, 500)(e);
    }
  });
});
</script>
