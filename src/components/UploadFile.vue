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
          <span v-html="this.translate('Click to browse or <br />drag and drop your files')"></span>
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
        :loadStatus="uploadStatus"
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
    <button class="submitUpload primary" @click="submitUpload">
      {{ this.translate('Submit') }}
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap');

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-BlackItalic.eot');
  src:
    url('/fonts/SFProDisplay-BlackItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-BlackItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-BlackItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-BlackItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-BlackItalic.svg#SFProDisplay-BlackItalic') format('svg');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-Bold.eot');
  src:
    url('/fonts/SFProDisplay-Bold.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-Bold.woff2') format('woff2'),
    url('/fonts/SFProDisplay-Bold.woff') format('woff'),
    url('/fonts/SFProDisplay-Bold.ttf') format('truetype'),
    url('/fonts/SFProDisplay-Bold.svg#SFProDisplay-Bold') format('svg');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-LightItalic.eot');
  src:
    url('/fonts/SFProDisplay-LightItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-LightItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-LightItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-LightItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-LightItalic.svg#SFProDisplay-LightItalic') format('svg');
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-HeavyItalic.eot');
  src:
    url('/fonts/SFProDisplay-HeavyItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-HeavyItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-HeavyItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-HeavyItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-HeavyItalic.svg#SFProDisplay-HeavyItalic') format('svg');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-Regular.eot');
  src:
    url('/fonts/SFProDisplay-Regular.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-Regular.woff2') format('woff2'),
    url('/fonts/SFProDisplay-Regular.woff') format('woff'),
    url('/fonts/SFProDisplay-Regular.ttf') format('truetype'),
    url('/fonts/SFProDisplay-Regular.svg#SFProDisplay-Regular') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-Medium.eot');
  src:
    url('/fonts/SFProDisplay-Medium.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-Medium.woff2') format('woff2'),
    url('/fonts/SFProDisplay-Medium.woff') format('woff'),
    url('/fonts/SFProDisplay-Medium.ttf') format('truetype'),
    url('/fonts/SFProDisplay-Medium.svg#SFProDisplay-Medium') format('svg');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-UltralightItalic.eot');
  src:
    url('/fonts/SFProDisplay-UltralightItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-UltralightItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-UltralightItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-UltralightItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-UltralightItalic.svg#SFProDisplay-UltralightItalic') format('svg');
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-ThinItalic.eot');
  src:
    url('/fonts/SFProDisplay-ThinItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-ThinItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-ThinItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-ThinItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-ThinItalic.svg#SFProDisplay-ThinItalic') format('svg');
  font-weight: 100;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay-SemiboldItalic.eot');
  src:
    url('/fonts/SFProDisplay-SemiboldItalic.eot?#iefix') format('embedded-opentype'),
    url('/fonts/SFProDisplay-SemiboldItalic.woff2') format('woff2'),
    url('/fonts/SFProDisplay-SemiboldItalic.woff') format('woff'),
    url('/fonts/SFProDisplay-SemiboldItalic.ttf') format('truetype'),
    url('/fonts/SFProDisplay-SemiboldItalic.svg#SFProDisplay-SemiboldItalic') format('svg');
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

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
.ar_AE .files-container {
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
