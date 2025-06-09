<template>
  <div class="writer">
    <div class="writer-control">
      <h1>Writer API playground</h1>
      <div class="select-box">
        <el-select v-model="tone" placeholder="选择写作风格">
          <el-option v-for="item in toneOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="format" placeholder="选择输出格式">
          <el-option v-for="item in formatOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="length" placeholder="选择写作长度">
          <el-option v-for="item in lengthOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <el-input v-model="sharedContext" placeholder="请输入共享上下文" />
      <el-input v-model="inputTipsContext" placeholder="请输入提示上下文" />
      <el-input v-model="inputText" :autosize="{ minRows: 3, maxRows: 20 }" type="textarea" placeholder="请输入主要内容" />
      <div class="control-btn">
        <el-button type="primary" @click="onSubmit" :loading="isLoading">
          确定
        </el-button>
        <el-button @click="onReset">清空</el-button>
      </div>
      <div class="tips-box">
        {{ tipsText }}
      </div>
    </div>
    <div class="output-box">
      <div class="chat-box">
        <div class="chat-box-item" v-for="item in outputArray" :key="item.id">
          <div class="player">{{ item.player }}</div>
          <div v-if="item.type === 'plain-text'" class="content">
            {{ item.content }}
          </div>
          <div v-if="item.type === 'markdown'" class="content">
            <MarkdownRenderer class="markdown-body" :markdownStr="item.content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, onUpdated, onBeforeUnmount } from "vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";

const inputText = ref("");
const inputTipsContext = ref("");
const sharedContext = ref("");
const tipsText = ref("");
const outputArray = ref(
  localStorage.getItem("writer")
    ? JSON.parse(localStorage.getItem("writer"))
    : []
);
const outputArrayId = ref(0);
const tone = ref("neutral");
const format = ref("plain-text");
const length = ref("medium");
let writer;

const isLoading = ref(false);

// 写作风格
const toneOptions = [
  { value: "neutral", label: "自然" },
  { value: "casual", label: "轻松" },
  { value: "formal", label: "正式" },
];
// 输出格式
const formatOptions = [
  { value: "plain-text", label: "纯文本" },
  { value: "markdown", label: "Markdown" },
];
// 输出长度
const lengthOptions = [
  { value: "short", label: "短" },
  { value: "medium", label: "中" },
  { value: "long", label: "长" },
];

const options = {
  sharedContext: sharedContext.value, // 共享上下文，主要用于编写多个输出
  tone: tone.value, // 写作风格可以指内容的风格、特征或态度
  format: format.value, // 输出格式
  length: length.value, // 输出的长度
  monitor(monitor) {
    monitor.addEventListener("downloadprogress", (e) => {
      const percent = Math.round(e.loaded * 100);
      tipsText.value = `📦 下载中: ${percent}%`;
    });
    monitor.addEventListener("downloadcomplete", () => {
      tipsText.value = "✅ 模型下载完成";
    });
    monitor.addEventListener("error", (err) => {
      tipsText.value = "❌ 模型下载出错" + err;
    });
  },
};

const loadWriter = async () => {
  if (!"Writer" in self) {
    tipsText.value = "⚠️ 当前浏览器不支持 Writer API";
    return;
  }
  try {
    writer = await window.Writer.create(options);
    tipsText.value = "✅ Writer 初始化成功";
  } catch (err) {
    tipsText.value = "❌ 初始化 Writer 失败";
  }
};

const onSubmit = async () => {
  if (!inputText.value) {
    tipsText.value = "⚠️ 请输入内容";
    return;
  }
  isLoading.value = true;
  // 我输入的内容
  const myOutputItem = {
    id: outputArrayId.value++,
    player: "我",
    content: inputText.value,
    type: "plain-text",
  };
  outputArray.value.push(myOutputItem);
  inputText.value = "";
  // ai 输出的内容
  const aiOutputItem = {
    id: outputArrayId.value++,
    player: "AI",
    content: "📝 正在生成中...",
    type: format.value,
  };
  outputArray.value.push(aiOutputItem);
  // 采用流式输出
  try {
    const result = await writer.writeStreaming(myOutputItem.content, {
      context: inputTipsContext.value, // 可选，提供背景信息
    });
    if (result) {
      let output = "";
      // 取出输出列表栈顶元素
      for await (const chunk of result) {
        console.log("chunk", chunk);
        output += chunk;
        outputArray.value[outputArray.value.length - 1].content = output;
      }
    }
  } catch (error) {
    outputArray.value[outputArray.value.length - 1].content =
      "❌ 生成失败: " + error;
  } finally {
    isLoading.value = false;
  }
  // 缓存对应的输出
  localStorage.setItem("writer", JSON.stringify(outputArray.value));
};

const onReset = () => {
  inputText.value = "";
  inputTipsContext.value = "";
  sharedContext.value = "";
  tipsText.value = "✅ Writer 初始化成功";
  outputArray.value = [];
  localStorage.removeItem("writer");
};

onMounted(async () => {
  await loadWriter();
});

onBeforeUnmount(() => {
  writer?.destroy();
})

onUpdated(() => {
  const container = document.querySelector('.output-box');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
});
</script>

<style scoped>
.writer {
  display: flex;
}

.writer-control {
  width: 40%;
  height: calc(100vh - 60px);
  padding: 20px;
  border-right: 1px solid var(--el-menu-border-color);
}

.select-box,
.el-input,
.el-textarea,
.control-btn,
.tips-box {
  margin-top: 20px;
}

.select-box {
  display: flex;
  justify-content: space-between;
}

.select-box .el-select:not(:last-child) {
  margin-right: 10px;
}

.output-box {
  height: calc(100vh - 60px);
  width: 60%;
  padding: 20px;
  overflow-y: auto;
}

.chat-box-item {
  margin-bottom: 30px;
  display: flex;
}

.player {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-9);
  margin-right: 20px;
}

.content {
  flex: 1;
  min-height: 40px;
  padding-top: 7px;
}
</style>
