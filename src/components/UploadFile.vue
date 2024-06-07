<script>
import { STATUS, FILES_RETRIEVAL_MODE } from '@/Enums.js'
import ListFiles from './ListFiles.vue'

export default {
  data() {
    return {
      /*** ENUMS ****/
      STATUS: STATUS,

      /*** Local State *****/
      filesRetrievalMode: FILES_RETRIEVAL_MODE.RECENT,
      statusMessage: '',
      selectedFiles: [],
      inputFiles: null,
      allowedTypes: {
        'application/pdf': 'PDF',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'OFFICE',
        'image/jpeg': 'Images',
        'image/gif': 'Images',
        'image/svg+xml': 'Images',
        'image/png': 'Images'
      },
      draggedOver: '' // values: uploader-active

      /**** CONSTANTS *****/
    }
  },
  watch: {
    uploadStatus(val) {
      debugger
      // If the files are uploaded Successfully, remove the selected files from the upload component.
      if (val == STATUS.SUCCESS) {
        this.statusMessage = ''
        this.selectedFiles = []
      }
    }
  },
  components: {
    ListFiles
  },
  props: {
    uploadStatus: String,
    translate: Function
  },
  computed: {
    // Generate a textual list of the allowed Item Types from allowedTypes
    allowedFileTypes() {
      let allowedArray = []
      for (let item in this.allowedTypes) {
        let typeText = this.allowedTypes[item]
        // Ignore any duplicates
        if (allowedArray.indexOf(typeText) == -1) {
          allowedArray.push(typeText)
        }
      }
      // Convert to comma seperated string!
      return allowedArray.toString()
    },
    filesForListComponent() {
      let finalFiles = []
      for (let f in this.selectedFiles) {
        let file = this.selectedFiles[f]
        finalFiles.push({
          id: f,
          file_name: file.name,
          original_file_name: file.name,
          file_size: file.size,
          file_type: file.type
        })
      }
      return finalFiles
    }
  },
  methods: {
    uploadFiles() {
      console.log('upload started')
      this.$emit('uploadFiles', this.selectedFiles)
    },
    dropHandler(ev) {
      //this.selectedFiles = []
      this.draggedOver = ''
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
      try {
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          ;[...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === 'file') {
              const file = item.getAsFile()
              this.checkAllowedFileType(file.type)
              console.log(file)
              console.log(`… file[${i}].name = ${file.name}`)
              this.selectedFiles.push(file)
            }
          })
        } else {
          // Use DataTransfer interface to access the file(s)
          ;[...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`)
            this.checkAllowedFileType(file.type)
            this.selectedFiles.push(file)
          })
        }
        this.statusMessage =
          '<span style="color: green">' +
          this.selectedFiles.length +
          ' ' +
          this.translate('files selected.') +
          '</span>'
      } catch (err) {
        this.statusMessage = '<span style="color: red">' + err + '</span>'
      }
    },
    checkAllowedFileType(fileType) {
      if (!this.allowedTypes[fileType]) {
        throw (
          this.translate('File type: ') +
          fileType +
          this.translate(' is not allowed <br /> Allowed file types are: ') +
          this.allowedFileTypes
        )
      }
    },
    dragHandler(ev) {
      console.log('File(s) in drop zone: ', ev)
      this.draggedOver = 'uploader-active'
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault()
    },
    dragOutHandler(ev) {
      console.log('File(s) out of drop zone: ', ev)
      this.draggedOver = ''
    },
    handleFileUpload(event) {
      try {
        console.log('selected files', event.target.files)
        ;[...event.target.files].forEach((file, i) => {
          this.checkAllowedFileType(file.type)
          console.log(file)
          console.log(`… file[${i}].name = ${file.name}`)
          this.selectedFiles.push(file)
        })
        this.statusMessage =
          '<span style="color: green">' +
          this.selectedFiles.length +
          ' ' +
          this.translate('files selected.') +
          '</span>'
      } catch (err) {
        this.statusMessage = '<span style="color: red">' + err + '</span>'
      }
    },
    simulateClickFileUpload() {
      console.log(this.$refs)
      var elem = this.$refs.fileButton
      elem.click()
    },
    submitUpload() {
      // TODO: move this to the Submit button
      this.uploadFiles()
    },
    removeFile(id) {
      this.selectedFiles.splice(id, 1)
      this.statusMessage =
        '<span style="color: green">' +
        this.selectedFiles.length +
        ' ' +
        this.translate('files selected.') +
        '</span>'
    }
  },
  mounted() {}
}
</script>

<template>
  <div class="upload-wrapper">
    <div v-if="uploadStatus == STATUS.PENDING" class="loading">
      {{ this.translate('loading') }}...
    </div>
    <div class="upload-container">
      <div class="body">
        <div class="files-container">
          <div
            class="file-uploader"
            :class="draggedOver"
            :ondrop="dropHandler"
            :ondragover="dragHandler"
            :ondragleave="dragOutHandler"
            :ondragend="dragOutHandler"
            @click="simulateClickFileUpload"
          >
            <span
              v-html="this.translate('Click to browse or <br />drag and drop your files')"
            ></span>
            <input
              v-on:change="handleFileUpload"
              type="file"
              ref="fileButton"
              multiple
              style="display: none"
            />
          </div>
        </div>
        <ListFiles
          v-if="selectedFiles.length"
          :files="filesForListComponent"
          :viewAllUploads="false"
          :remove="true"
          :update="false"
          :translate="translate"
          @removeFile="removeFile"
        />
      </div>
    </div>
    <div v-if="statusMessage" class="footer">
      <span class="statusMessage" v-html="statusMessage"></span>
      <button class="submitUpload primary" @click="submitUpload" v-if="selectedFiles.length">
        {{ this.translate('Submit') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.files-container {
  font-family: 'SF Pro Display';
  font-weight: 200;
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  position: relative;
  background: var(--secondary-background);
}
[lang='ar_AE'] .files-container {
  font-family: 'Noto Kufi Arabic', sans-serif;
}
.file-uploader {
  min-height: 109px;
  border: 2px dashed var(--secondary-border);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  color: #a7a7a7;
  text-align: center;
  cursor: pointer;
}
.uploader-active {
  border: 2px dashed var(--active);
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.submitUpload {
}
</style>
