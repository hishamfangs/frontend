<script>
import ListFiles from './components/ListFiles.vue'
import UploadFile from './components/UploadFile.vue'
import { useFilesStore } from './stores/filesStore'

/****** ENUM for Selected Section ******/
import { SECTION, STATUS } from './Enums.js'

export default {
  components: {
    ListFiles,
    UploadFile
  },
  data() {
    return {
      SECTION: SECTION,
      STATUS: STATUS,
      selectedSection: SECTION.RECENT, // Default Section
      files: [],
      filesStore: useFilesStore(),
      loadStatus: STATUS.IDLE,
      failedMessage: '',
      lastSyncedDate: new Date()
    }
  },
  methods: {
    // Change Sections from Upload a new File to Recent files.
    switchSection(event) {
      this.selectedSection = event.target.name
    },

    // Retrieve the files from the REST API
    async getFiles(mode) {
      this.loadStatus = STATUS.PENDING
      try {
        await this.filesStore.getFiles(mode)
        this.lastSyncedDate = this.filesStore.lastSyncedDate
        this.loadStatus = STATUS.SUCCESS
      } catch (err) {
        console.log(err)
        this.failedMessage = err
        this.loadStatus = STATUS.FAILED
      }
      this.files = this.filesStore.files
    }
  },
  async mounted() {
    //const filesStore = useFilesStore();
    await this.getFiles()
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
          <img src="/icons/settings.svg" class="Icon-Settings" />
        </div>
      </div>
      <div class="body">
        <UploadFile v-if="selectedSection == SECTION?.NEW_UPLOAD" />
        <ListFiles
          v-else-if="selectedSection == SECTION?.RECENT"
          :files="files"
          :loadStatus="loadStatus"
          :lastSyncedDate="lastSyncedDate"
          @getFiles="getFiles"
        />
      </div>
    </div>
  </main>
</template>

<style>
:root {
  --primary-text: #242634;
  --primary-border: #ebeff2;
  --button-border: #cdd3d8;
  --background: #f0f0f1;
  --secondary-background: #f8f8f8;
  --active: #4353ff;
  --secondary-border: #e2e6ea;
}
html,
body,
#app {
  margin: 0;
  width: 100%;
  height: 100%;
}
body {
  background: var(--background);
  color: var(--primary-text);
}

html,
body,
*,
div,
span {
  box-sizing: border-box;
}

main {
  width: 100%;
  font-family: Tahoma, Helvetica, sans-serif;
  font-size: 14px;
  padding: 40px;
  max-width: 80%;
  margin: auto;
}
.container {
  display: flex;
  border-radius: 16px;
  background: white;
  overflow: hidden;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-shadow: 0px 0px 48px 0px #1927590f;
}
.header {
  position: relative;
  align-self: center;
  background: white;
  height: 68px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid var(--primary-border);
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
  color: var(--active);
  border: 0px;
  font-size: 12px;
  font-weight: 600;
}
.active {
  background-color: var(--active);
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
.refreshed-notice {
  color: rgb(157, 157, 157);
  font-size: 0.8em;
  display: inline-block;
  margin-left: 20px;
}
.footer {
  font-size: 12px;
  background: #f7f9fb;
  padding: 14px 20px;
}

@media screen and (max-width: 1024px) {
  main {
    max-width: 100%;
  }
}
</style>
