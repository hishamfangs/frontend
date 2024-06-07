import axios from 'axios'

export default {
  apiClient: axios.create({
    baseURL: 'https://nodejs-astratech.onrender.com/',
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
  },
  async loginUser(username, password) {
    /* let formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
 */
    try {
      var res = await this.apiClient.post('/login', {
        username: username,
        password: password
      })

      return res.data
    } catch (err) {
      let error = 'Login Failed: ' + err
      console.log(error)
      throw error
    }
  }
}
