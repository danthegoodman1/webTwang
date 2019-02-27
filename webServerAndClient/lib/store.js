const EventEmitter = require('events')
const globalBus = new EventEmitter()

const Store = class {
    constructor(defaultStore = {}) {
        this.store = defaultStore
    }
    
    getStore() {
        return this.store
    }
    
    setStore(newObj) {
        const keys = Object.keys(newObj)
        keys.forEach((ele, ind) => {
            this.store[ele] = newObj[ele]
        })
        globalBus.emit('globalStateUpdate', this.store)
    }
}
const store = new Store({
    debugModalShow: 'none',
    gameStarted: false,
    waitingColors: ['rgba(246, 36, 89, 1)', 'rgba(246, 71, 71, 1)', 'rgba(165, 55, 253, 1)', 'rgba(155, 89, 182, 1)', 'rgba(0, 181, 204, 1)', 'rgba(25, 181, 254, 1)', 'rgba(134, 226, 213, 1)', 'rgba(102, 204, 153, 1)', 'rgba(255, 255, 126, 1)', 'rgba(238, 238, 0, 1)', 'rgba(252, 185, 65, 1)', 'rgba(255, 203, 5, 1)'],
    waitingDots: 0,
    debugLed: false,
    lightColor: []
})

export {globalBus, store}
