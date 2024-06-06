<script>
import { STATUS, FILES_RETRIEVAL_MODE } from '@/Enums.js'
export default {
  data() {
    return {
      /*** ENUMS ****/
      STATUS: STATUS,
      FILES_RETRIEVAL_MODE: FILES_RETRIEVAL_MODE,

      /*** Local State *****/
      filesRetrievalMode: FILES_RETRIEVAL_MODE.RECENT,
      syncedSeconds: 0,
      timerInterval: null,

      /**** CONSTANTS *****/
      ICONS: {
        default: 'default.svg',
        'application/pdf': 'pdf.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'office.svg',
        'image/jpeg': 'image.svg'
      }
    }
  },
  props: {
    files: Object,
    loadStatus: String,
    lastSyncedDate: Date
  },
  watch: {
    lastSyncedDate() {
      this.runSyncTimer()
    }
  },
  computed: {
    getFileslabel() {
      console.log(this.filesRetrievalMode)
      if (this.filesRetrievalMode == FILES_RETRIEVAL_MODE.RECENT) {
        return 'View all uploads'
      } else {
        return 'View recent'
      }
    },
    lastSynced() {
      if (this.syncedSeconds >= 60) {
        // minutes
        let minutes = Math.floor(this.syncedSeconds / 60)
        if (minutes == 1) {
          return minutes + ' minute'
        }
        return minutes + ' minutes'
      } else {
        // seconds
        if (this.syncedSeconds == 1) {
          return this.syncedSeconds + ' second'
        }
        return this.syncedSeconds + ' seconds'
      }
    }
  },
  methods: {
    toggleGetFiles() {
      console.log('toggled')
      if (this.filesRetrievalMode == FILES_RETRIEVAL_MODE.RECENT) {
        this.filesRetrievalMode = FILES_RETRIEVAL_MODE.ALL
      } else {
        this.filesRetrievalMode = FILES_RETRIEVAL_MODE.RECENT
      }
      this.getFiles()
    },
    getFiles(mode) {
      if (!mode) {
        mode = this.filesRetrievalMode
      }
      this.$emit('getFiles', mode)
    },
    fillIcon(file) {
      let iconFilename = ''
      if (!file) {
        file.file_type = 'default'
      }
      iconFilename = this.ICONS[file.file_type]
      return '/icons/' + iconFilename
    },
    fillFilename(file) {
      let filename = this.sanitizeFilename(file.original_file_name)
      return filename
    },
    fillFileSizeOrStatus(file) {
      if (!file.file_size) {
        return 'error'
      }
      let filesize = Math.ceil(file.file_size / 1000)
      return filesize + 'KB'
    },
    fillLastUpdated(file) {
      let lastUpdatedMsg = ''
      let now = new Date()
      let created = file.datetime_created ? new Date(file.datetime_created) : null //'2024-01-22T07:20:18.000Z',
      let updated = file.datetime_updated ? new Date(file.datetime_updated) : null
      let lastDated = updated?.getTime() > created?.getTime() ? updated : created
      let timeDifference = 0
      if (lastDated) {
        timeDifference = now.getTime() - lastDated.getTime()
      }
      // Return Seconds
      if (timeDifference / 1000 / 60 < 1) {
        lastUpdatedMsg = `${Math.floor(timeDifference / 1000)}s ago`
      }
      // Return Minutes
      if (timeDifference / 1000 / 60 >= 1) {
        lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60)}m ago`
      }
      // Return Hours
      if (timeDifference / 1000 / 60 >= 60) {
        lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60 / 60)} hours ago`
      }
      // Return Days
      if (timeDifference / 1000 / 60 / 60 >= 24) {
        lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60 / 60 / 24)} days ago`
      }
      return lastUpdatedMsg
    },
    sanitizeFilename(filename) {
      return filename
    },
    runSyncTimer() {
      // Create timer that will run every 10 seconds to update the last Synced by seconds
      clearInterval(this.timerInterval)
      let calculateSeconds = () => {
        this.syncedSeconds =
          Math.floor(new Date().getTime() / 1000) - Math.floor(this.lastSyncedDate.getTime() / 1000)
      }
      calculateSeconds()
      this.timerInterval = setInterval(() => {
        calculateSeconds()
      }, 1000 * 10)
    }
  },
  mounted() {
    this.runSyncTimer()
  }
}
</script>

<template>
  <div class="list-container">
    <div class="body">
      <div class="files-container">
        <div v-if="loadStatus == STATUS.PENDING" class="loader">loading...</div>
        <div class="file-container" v-for="file in files" :key="file.id">
          <div class="details">
            <span class="icon"><img :src="fillIcon(file)" /></span>
            <div class="user-journey">
              <div class="filename">{{ fillFilename(file) }}</div>
              <div class="last-updated">{{ fillLastUpdated(file) }}</div>
            </div>
          </div>
          <div class="tag">{{ fillFileSizeOrStatus(file) }}</div>
          <div class="menu">:</div>
        </div>
      </div>
      <div class="view-all-container">
        <button class="view-all-uploads" @click="toggleGetFiles">{{ getFileslabel }}</button>
      </div>
    </div>
  </div>
  <div class="footer">
    <span
      ><i></i> Last Synced: {{ lastSynced }} ago
      <span class="refreshed-notice">(refreshed every 10 seconds / 1 minute)</span></span
    >
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

.files-container {
  font-family: Inter;
  font-weight: 500;
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  position: relative;
  min-height: 200px;
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
  border-bottom: 1px solid var(--primary-border);
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
  position: relative;
  align-self: center;
  flex-grow: 0;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 16px;
  letter-spacing: normal;
  text-align: left;
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
  border: solid 1px var(--button-border);
  font-size: 11px;
  font-weight: 600;
}
.icon {
  width: 16px;
  height: 16px;
  margin: 0 16px;
}

.last-updated {
  font-size: 0.8em;
  line-height: 14px;
}

.view-all-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}
.view-all-uploads {
  padding: 7px 20px;
  color: var(--primary-text);
  border: 1px solid var(--button-border);
  border-radius: 40px;
}
.loader {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}
</style>
