Page({
  data: {
    activeTab: 'scenic',
    scenicSpots: [],
    routes: [],
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
    const baseUrl = 'http://localhost:7001/api';

    Promise.all([
      new Promise(resolve => {
        wx.request({ url: baseUrl + '/scenic-spots', success: r => resolve(r.data.data || []), fail: () => resolve([]) });
      }),
      new Promise(resolve => {
        wx.request({ url: baseUrl + '/routes', success: r => resolve(r.data.data || []), fail: () => resolve([]) });
      }),
    ]).then(([spots, routes]) => {
      this.setData({ scenicSpots: spots, routes, loading: false });
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
});
