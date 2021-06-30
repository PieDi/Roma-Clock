// index.js
// 获取应用实例
const app = getApp()
const myaudio = wx.createInnerAudioContext();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    monthTexts: [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    dayTexts: [
      '一日', '二日', '三日', '四日', '五日', '六日', '七日', '八日', '九日', '十日',
      '十一日', '十二日', '十三日', '十四日', '十五日', '十六日', '十七日', '十八日', '十九日', '二十日', 
      '二十一日', '二十二日', '二十三日', '二十四日', '二十五日', '二十六日', '二十七日', '二十八日', '二十九日', '三十日', '三十一日'
    ],
    hourTexts: [
      '一时', '二时', '三时', '四时', '五时', '六时', '七时', '八时', '九时', '十时', '十一时', '十二时',
      '十三时', '十四时', '十五时', '十六时', '十七时', '十八时', '十九时', '二十时', '二十一时', '二十二时', '二十三时', '二十四时'
    ],
    minuteTexts: [
      '零零', '一分', '二分', '三分', '四分', '五分', '六分', '七分', '八分', '九分', '十分',
      '十一分', '十二分', '十三分', '十四分', '十五分', '十六分', '十七分', '十八分', '十九分', '二十分',
      '二十一分', '二十二分', '二十三分', '二十四分', '二十五分', '二十六分', '二十七分', '二十八分', '二十九分', '三十分',
      '三十一分', '三十二分', '三十三分', '三十四分', '三十五分', '三十六分', '三十七分', '三十八分', '三十九分', '四十分',
      '四十一分', '四十二分', '四十三分', '四十四分', '四十五分', '四十六分', '四十七分', '四十八分', '四十九分', '五十分',
      '五十一分', '五十二分', '五十三分', '五十四分', '五十五分', '五十六分', '五十七分', '五十八分', '五十九分'
    ],
    secondTexts: [
      '零零', '一秒', '二秒', '三秒', '四秒', '五秒', '六秒', '七秒', '八秒', '九秒', '十秒',
      '十一秒', '十二秒', '十三秒', '十四秒', '十五秒', '十六秒', '十七秒', '十八秒', '十九秒', '二十秒',
      '二十一秒', '二十二秒', '二十三秒', '二十四秒', '二十五秒', '二十六秒', '二十七秒', '二十八秒', '二十九秒', '三十秒',
      '三十一秒', '三十二秒', '三十三秒', '三十四秒', '三十五秒', '三十六秒', '三十七秒', '三十八秒', '三十九秒', '四十秒',
      '四十一秒', '四十二秒', '四十三秒', '四十四秒', '四十五秒', '四十六秒', '四十七秒', '四十八秒', '四十九秒', '五十秒',
      '五十一秒', '五十二秒', '五十三秒', '五十四秒', '五十五秒', '五十六秒', '五十七秒', '五十八秒', '五十九秒'
    ],
    boxSize: {
      months: 30,
      days: 80,
      hours: 150,
      minutes: 220,
      seconds: 300
    },
    // 定义当前时间
    currentMonths: 0, // 月
    currentDays: 0, // 日
    currentHours: 0, // 时
    currentMinutes: 0, // 分
    currentSeconds: 0, // 秒
    monthsDeg: 0,
    daysDeg: 0,
    hoursDeg: 0,
    minutesDeg: 0,
    secondsDeg: 0,
    // 定时器
    timer: null,
    isFullScreen: false,
    isSound: false,
    monthStyle: {}
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    myaudio.src = '/pages/assets/music.mp3'
    this.init()
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow() {
    clearInterval(this.data.timer)
    this.init()
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  init() {
    
    const d = new Date()
    const year = d.getFullYear() // 年
    const month = d.getMonth() + 1 // 月
    const day = d.getDate() // 日
    const hours = d.getHours() // 时
    const minutes = d.getMinutes() // 分
    const seconds = d.getSeconds() // 秒
    const monthDays = new Date(year, month, 0).getDate()
    this.setData({
      // 删除多余的天数
      dayTexts: this.data.dayTexts.slice(0, monthDays),
      // 当前时间
      currentMonths: month,
      currentDays: day,
      currentHours: hours,
      currentMinutes: minutes,
      currentSeconds: seconds,
       // 角度
      monthsDeg: (month - 1) * 30,
      daysDeg: (day - 1) * this.getPerDeg(this.data.dayTexts),
      hoursDeg: (hours - 1) * 15,
      minutesDeg:  minutes * 6,
      secondsDeg: seconds * 6,
      // 设置定时器
      timer: setInterval(() => {
        this.runClock()
        myaudio.play();
      }, 1000)
    })
  },

  getPerDeg(texts) {
    return 360 / texts.length
  },

  runClock() {
    const d = new Date()
    const month = d.getMonth() + 1 // 月
    const day = d.getDate() // 日
    const hours = d.getHours() // 时
    const minutes = d.getMinutes() // 分
    const seconds = d.getSeconds() // 秒
    if (this.data.currentMonths !== month) {
      this.setData({
        currentMonths: month,
        monthsDeg: this.data.monthsDeg + 30
      })
    }
    if (this.data.currentDays !== day) {
      this.setData({
        currentDays: day,
        daysDeg: this.data.daysDeg + this.getPerDeg(this.data.dayTexts)
      })
    }
    if (this.data.currentHours !== hours) {
      this.setData({
        currentHours: hours,
        hoursDeg: this.data.hoursDeg + 15
      })
    }
    if (this.data.currentMinutes !== minutes) {
      this.setData({
        currentMinutes: minutes,
        minutesDeg: this.data.minutesDeg + 6
      })
    }
    this.setData({
      currentSeconds: seconds,
      secondsDeg: this.data.secondsDeg + 6 
    }, ()=>{
      this.setData({
        
      })
    })
  }
})
