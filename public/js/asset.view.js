class AssetView {

  constructor() {
  }

  async getAssets(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/all/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getCategories(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/categories/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getCustomAttdef(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/custom_attdef/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getStatus(projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/asset/status/${projectId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }
}