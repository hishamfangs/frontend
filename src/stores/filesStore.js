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
    _language: 'en_US',
    _token: ''
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
    },
    token: (state) => {
      return state._token
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
    async loginUser(username, password) {
      try {
        let res = await fileService.loginUser(username, password)
        if (res && !res.error) {
          this.setToken(res.access_token)
        } else {
          this.setToken('')
        }
        return res
      } catch (err) {
        return { error: err }
      }
    },
    logout() {
      this.setToken('')
    },
    setFiles(payload) {
      this._files = payload
    },
    setLastSyncedDate(payload) {
      this._lastSyncedDate = payload
    },
    setToken(payload) {
      this._token = payload
    }
  }
})
