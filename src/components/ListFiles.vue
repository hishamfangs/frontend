<script>
export default {
  data() {
    return {}
  },
  props: {
    files: Object
  },
  methods: {
    processFileSizeStatus(file) {
      return file.file_size / 1000 + 'KB'
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="body">
      <div class="files-container">
        <div class="file-container" v-for="file in files" :key="file.id">
          <div class="details">
            <span class="icon pdf"></span>
            <div class="user-journey">{{ file.original_file_name }}</div>
          </div>
          <div class="tag">{{ processFileSizeStatus(file) }}</div>
          <div class="menu">:</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.files-container {
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
}
.file-container {
  height: 51px;
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  padding: 0;
  border-bottom: 1px solid #ebeff2;
}
.footer {
}

.details {
  height: 34px;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 16px;
  padding: 0;
  align-items: center;
}
.user-journey {
  height: 16px;
  align-self: center;
  flex-grow: 0;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #242634;
}
.tag {
  width: auto;
  height: 20px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 2px;
  border: solid 1px #cdd3d8;
}
.icon {
  width: 16px;
  height: 16px;
  margin: 0 16px;
}
.pdf {
  background: url(@/assets/pdf.svg);
}
</style>
