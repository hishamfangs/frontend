//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import fileService from '@/services/fileService'

export const useFilesStore = defineStore({
  id: 'filesStore',
  state: () => ({
    _files: [],
    _uploadedFiles: [],
    _lastSyncedDate: new Date()
  }),
  getters: {
    files: (state) => {
      return state._files
    },
    uploadedFiles: (state) => {
      return state._uploadedFiles
    },
    lastSyncedDate: (state) => {
      return state._lastSyncedDate
    }
  },
  actions: {
    async getFiles(payload) {
      let files = await fileService.getFiles(payload)
      this.setLastSyncedDate(new Date())
      this.setFiles(files)
    },
    async uploadFiles(payload) {},
    async updateFileInfo(payload) {},
    setFiles(payload) {
      this._files = payload
    },
    setLastSyncedDate(payload) {
      this._lastSyncedDate = payload
    }
  }
})
