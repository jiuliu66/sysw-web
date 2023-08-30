<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col>
        <div class="content-wrapper">
          欢迎使用宿迁电信管理系统
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    components: {
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .content-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      font-size: 20px;
      color: #b4bccc;
    }
  }
</style>
