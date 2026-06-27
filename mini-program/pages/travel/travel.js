Page({
  data: {
    activeTab: 'scenic',
    scenicSpots: [],
    routes: [],
    transportGuides: [],
    eTickets: [],
    loading: true,
    token: '',
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    this.setData({ token });
    this.loadData();
  },

  loadData() {
    this.setData({ loading: true });
    const baseUrl = 'http://127.0.0.1:7001/api';

    Promise.all([
      new Promise(resolve => {
        wx.request({ url: baseUrl + '/scenic-spots', success: r => resolve(r.data.data || []), fail: () => resolve([]) });
      }),
      new Promise(resolve => {
        wx.request({ url: baseUrl + '/routes', success: r => resolve(r.data.data || []), fail: () => resolve([]) });
      }),
      new Promise(resolve => {
        wx.request({ url: baseUrl + '/transport-guides', success: r => resolve(r.data.data || []), fail: () => resolve([]) });
      }),
    ]).then(([spots, routes, guides]) => {
      this.setData({ scenicSpots: spots, routes, transportGuides: guides, loading: false });
    });

    // 加载电子票
    if (this.data.token) {
      wx.request({
        url: baseUrl + '/e-tickets',
        header: { Authorization: 'Bearer ' + this.data.token },
        success: r => { if (r.data.code === 0) this.setData({ eTickets: r.data.data }); },
      });
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  goToScenicSpot(e) {
    wx.navigateTo({ url: '/pages/travel/scenic-spot?id=' + e.currentTarget.dataset.id });
  },

  goToRoute(e) {
    wx.navigateTo({ url: '/pages/travel/route?id=' + e.currentTarget.dataset.id });
  },

  goToTransportGuide(e) {
    wx.navigateTo({ url: '/pages/travel/transport-guide?id=' + e.currentTarget.dataset.id });
  },

  goToETicket(e) {
    if (!this.data.token) {
      wx.navigateTo({ url: '/pages/user/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/travel/e-ticket?id=' + e.currentTarget.dataset.id });
  },

  goToOrders() {
    if (!this.data.token) {
      wx.navigateTo({ url: '/pages/user/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/travel/orders' });
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/user/login' });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          this.setData({ token: '', eTickets: [] });
          wx.showToast({ title: '已退出', icon: 'none' });
        }
      },
    });
  },
});
