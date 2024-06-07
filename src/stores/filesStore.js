//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import fileService from '@/services/fileService'
import translation from '@/translations'

export const useFilesStore = defineStore({
  id: 'filesStore',
  state: () => ({
    _files: [],
    _uploadedFiles: [],
    _lastSyncedDate: new Date(),
    _language: 'en_US'
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
    },
    language: (state) => {
      return state._language
    }
  },
  actions: {
    setLanguage(lang) {
      this._language = lang
    },
    translate(msg) {
      return translation.translate(msg, this.language)
    },
    async getFiles(payload) {
      let files = await fileService.getFiles(payload)
      this.setLastSyncedDate(new Date())
      this.setFiles(files)
    },
    async uploadFiles(payload) {
      try {
        let res = await fileService.uploadFiles(payload)
        return res
      } catch (err) {
        return err
      }
    },
    async removeFile(payload) {
      try {
        let res = await fileService.removeFile(payload)
        return res
      } catch (err) {
        return err
      }
    },
    async updateFile(payload) {
      try {
        let res = await fileService.updateFile(payload)
        return res
      } catch (err) {
        return err
      }
    },
    setFiles(payload) {
      this._files = payload
    },
    setLastSyncedDate(payload) {
      this._lastSyncedDate = payload
    }
  }
})
