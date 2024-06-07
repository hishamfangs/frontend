import axios from 'axios'

export default {
  apiClient: axios.create({
    baseURL: 'http://localhost:3010/',
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }),

  async getFiles(mode) {
    var res = await this.apiClient.get('/getFiles', {
      params: {
        mode: mode
      }
    })
    let files = res.data
    return files
  },
  async removeFile(id) {
    var res = await this.apiClient.delete(`/delete/${id}`)
    let resp = res.data
    return resp
  },
  async updateFile(id) {
    var res = await this.apiClient.put(`/update/${id}`)
    let resp = res.data
    return resp
  },
  async uploadFiles(files) {
    let formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    try {
      var res = await this.apiClient.post('/uploadFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res
    } catch (err) {
      let error = 'Upload Files failed in the fileService: ' + err
      console.log(error)
      throw error
    }
  }
}
