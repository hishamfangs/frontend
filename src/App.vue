<script>
import ListFiles from './components/ListFiles.vue'
import UploadFile from './components/UploadFile.vue'

/****** ENUM for Selected Section ******/
import { SECTION } from './Enums.js'

export default {
  components: {
    ListFiles,
    UploadFile
  },
  data() {
    return {
      syncedMinutes: 0,
      SECTION: SECTION,
      selectedSection: SECTION.RECENT, // Default Section
      files: [
        {
          id: 2,
          file_name: '231d1b8fee322b186a95981d545cfdad.pdf',
          original_file_name: 'user-journey-01.pdf',
          file_path: '/var/uploads/231d1b8fee322b186a95981d545cfdad.pdf',
          file_size: 604642,
          file_type: 'application/pdf',
          is_deleted: 0,
          datetime_created: '2024-04-22T07:17:23.000Z',
          datetime_updated: null
        },
        {
          id: 3,
          file_name: '5a6386f08ae32c8c59ba290559576ee3.pptx',
          original_file_name: 'Strategy-Pitch-Final.pptx',
          file_path: '/var/uploads/5a6386f08ae32c8c59ba290559576ee3.pptx',
          file_size: 1462915,
          file_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          is_deleted: 0,
          datetime_created: '2024-03-22T07:18:41.000Z',
          datetime_updated: null
        },
        {
          id: 4,
          file_name: 'b3c75957616381f1771c618c78f83f10.jpg',
          original_file_name: 'man-holding-mobile-phone-while-sky-down-the-slope.jpg',
          file_path: '/var/uploads/b3c75957616381f1771c618c78f83f10.jpg',
          file_size: 932005,
          file_type: 'image/jpeg',
          is_deleted: 0,
          datetime_created: '2024-01-22T07:20:18.000Z',
          datetime_updated: null
        }
      ]
    }
  },
  methods: {
    processFileSizeStatus(file) {
      return file.file_size / 1000 + 'KB'
    },
    switchSection(event) {
      this.selectedSection = event.target.name
    }
  }
}
</script>

<template>
  <main>
    <div class="container">
      <div class="header">
        <div class="button-group">
          <button
            class="new-upload"
            name="new-upload"
            :class="[selectedSection == SECTION?.NEW_UPLOAD ? 'active' : '']"
            @click="switchSection"
          >
            New Upload
          </button>
          <button
            class="recent"
            name="recent"
            :class="[selectedSection == SECTION?.RECENT ? 'active' : '']"
            @click="switchSection"
          >
            Recent
          </button>
        </div>
        <div class="settings">
          <img src="@/assets/settings.svg" class="Icon-Settings" />
        </div>
      </div>
      <div class="body">
        <UploadFile v-if="selectedSection == SECTION?.NEW_UPLOAD" />
        <ListFiles v-else-if="selectedSection == SECTION?.RECENT" :files="files" />
        <div class="footer">
          <span><i></i> Last Synced: {{ syncedMinutes }} minutes ago</span>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
}
body {
  margin: 40px;
  background: #f0f0f1;
}

main {
  width: 100%;
  font-family: Tahoma, Helvetica, sans-serif;
  font-size: 14px;
}
.container {
  display: flex;
  border-radius: 16px;
  background: white;
  overflow: hidden;
  min-height: 400px;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}
.header {
  position: relative;
  align-self: center;
  height: 68px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid #ebeff2;
}
.button-group {
  width: auto;
  height: 36px;
  display: flex;
  gap: 4px;
  padding: 4px 5px;
  border-radius: 40px;
  box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.1);
  background-color: #f7f9fb;
}
button {
  cursor: pointer;
  width: auto;
  height: 28px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 7px 20px;
  border-radius: 40px;
  background-color: #f7f9fb;
  color: #4353ff;
  border: 0px;
  font-size: 12px;
  font-weight: 600;
}
.active {
  background-color: #4353ff;
  color: white;
}

.settings {
  width: 36px;
  height: 36px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 32px;
  border: solid 1px #ebeff2;
  position: absolute;
  right: 0px;
  margin: 20px;
}
img.Icon-Settings {
  width: 16px;
  height: 16px;
  flex-grow: 0;
  object-fit: contain;
}
.footer {
  font-size: 12px;
  background: #f7f9fb;
  padding: 14px 20px;
}
</style>
