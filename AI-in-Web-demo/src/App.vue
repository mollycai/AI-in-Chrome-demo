<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
          :default-active="route.path"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.index"
            :index="item.index"
          >
            {{ item.title }}
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const menuItems = ref([
  { index: "/writer", title: "Writer API" },
  { index: "/summarizer", title: "Summarizer API" },
  { index: "/prompt", title: "Prompt API" },
  { index: "/translator", title: "Translator API" },
]);

const router = useRouter();
const route = useRoute();

const handleSelect = (key) => {
  router.push(key);
};
</script>

<style scoped>
.common-layout {
  height: 100vh;
}
.el-header {
  padding: 0;
}
.el-container,
.el-main {
  height: 100%;
	padding: 0;
}
</style>
