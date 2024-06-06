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
  }
}
