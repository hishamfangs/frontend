<script>
import ListFiles from '../components/ListFiles.vue'
import UploadFile from '../components/UploadFile.vue'
import { useFilesStore } from '../stores/filesStore'

/****** ENUM for Selected Section ******/
import { SECTION, STATUS } from '../Enums.js'

export default {
  components: {
    ListFiles,
    UploadFile
  },
  data() {
    return {
      // ENUMS
      SECTION: SECTION,
      STATUS: STATUS,

      // Local State
      selectedSection: SECTION.RECENT, // Default Section
      files: [],
      filesStore: useFilesStore(),
      loadStatus: STATUS.IDLE,
      uploadStatus: STATUS.IDLE,
      failedMessage: '',
      lastSyncedDate: new Date()
    }
  },
  methods: {
    // Change Sections from Upload a new File to Recent files.
    switchSection(section) {
      this.selectedSection = section
    },
    switchSectionHandler(event) {
      this.switchSection(event.target.name)
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
    },

    // Upload Files
    async uploadFiles(files) {
      try {
        this.uploadStatus = STATUS.PENDING
        let res = await this.filesStore.uploadFiles(files)
        this.uploadStatus = STATUS.SUCCESS
        this.switchSection(SECTION.RECENT)
        this.files
        await this.getFiles()
      } catch (err) {
        this.uploadStatus = STATUS.FAILED
      }
    },
    async removeFile(id) {
      try {
        this.loadStatus = STATUS.PENDING
        let res = await this.filesStore.removeFile(id)
        this.loadStatus = STATUS.SUCCESS
      } catch (err) {
        this.loadStatus = STATUS.FAILED
      }
      await this.getFiles()
    },
    async updateFile(id) {
      try {
        this.loadStatus = STATUS.PENDING
        let res = await this.filesStore.updateFile(id)
        this.loadStatus = STATUS.SUCCESS
      } catch (err) {
        this.loadStatus = STATUS.FAILED
      }
      await this.getFiles()
    }
  },
  async mounted() {
    await this.getFiles()
  }
}
</script>

<template>
  <div class="file-manager">
    <LanguageSelector />
    <div class="container">
      <div class="header">
        <div class="button-group">
          <button
            class="new-upload"
            name="new-upload"
            :class="[selectedSection == SECTION?.NEW_UPLOAD ? 'active' : '']"
            @click="switchSectionHandler"
          >
            {{ filesStore.translate('New Upload') }}
          </button>
          <button
            class="recent"
            name="recent"
            :class="[selectedSection == SECTION?.RECENT ? 'active' : '']"
            @click="switchSectionHandler"
          >
            {{ filesStore.translate('Recent') }}
          </button>
        </div>
        <div class="settings">
          <img src="/icons/settings.svg" class="Icon-Settings" />
        </div>
      </div>
      <div class="body">
        <div :class="[this.selectedSection == SECTION.NEW_UPLOAD ? '' : 'hide']">
          <UploadFile
            @uploadFiles="uploadFiles"
            :uploadStatus="uploadStatus"
            :translate="filesStore.translate"
          />
        </div>
        <div :class="[this.selectedSection == SECTION.RECENT ? '' : 'hide']">
          <ListFiles
            :files="files"
            :loadStatus="loadStatus"
            :lastSyncedDate="lastSyncedDate"
            :viewAllUploads="true"
            :remove="true"
            :update="true"
            :translate="filesStore.translate"
            @getFiles="getFiles"
            @removeFile="removeFile"
            @updateFile="updateFile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-manager {
  width: 100%;
  font-size: 14px;
  padding: 40px;
  max-width: 80%;
  margin: 0px auto;
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
[lang='ar_AE'] .settings {
  right: auto;
  left: 0px;
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

@media screen and (max-width: 1024px) {
  .file-manager {
    max-width: 100%;
  }
}
</style>
