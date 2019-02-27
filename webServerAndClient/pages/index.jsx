import React from 'react'

import {store, globalBus} from '../lib/store' // Global Store
import '../assets/css/the.css' // CSS
const io = require('socket.io-client')
const socket = io(':8080')

import TwangLed from '../components/TwangLed.jsx'
import DebugModal from '../components/DebugModal'

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

export default class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lightCount: 25,
        }
        this.showModal = this.showModal.bind(this)
    }
    
    componentWillMount() {
        this.setState(store.getStore())
        // store.setStore({lightColor: [
        //     'blue',
        //     'lightGreen',
        //     'yellow'
        // ]})
        // this.setLedColor(4, 'blue')
        store.setStore({playerPos: 0, waitPos: -1, gameStarted: false}) // Little bit hacky on the waitpos but idgaf
        this.clearLeds()
    }
    
    componentDidMount() {
        globalBus.on('globalStateUpdate', (data) => {
            this.setState(data)
        }) // TODO: maybe move this to willMount? seems fine for now
        this.waitAnimation()
    }


    launchListener() {
        socket.on('update', (data) => {
            console.log(data)
                if (data.angle > 1) {
                    console.log('moving forward')
                    setTimeout(() => {
                        this.movePlayer(1)
                    }, 10000 / scale(Math.abs(data.angle), 0, 12, 100, 101));
                } else if (data.angle < -1) {
                    setTimeout(() => {
                        this.movePlayer(-1)
                        console.log(`waiting ${Math.abs(data.angle)}`)
                    }, 10000 / scale(Math.abs(data.angle), 0, 12, 100, 101))
                    console.log('moving back')
                } else if (data.magnitude) {
                    const theSpot = JSON.parse(JSON.stringify(this.state))
                    console.log('shaking')
                    setTimeout(() => {
                        this.setLedColor(theSpot.playerPos + 1, 'yellow')
                        this.setLedColor(theSpot.playerPos -1 , 'yellow')
                    }, 500)
                    setTimeout(() => {
                        this.setLedColor(theSpot.playerPos + 1, 'white')
                        this.setLedColor(theSpot.playerPos -1, 'white')
                    }, 1500)
                }
        })
    }

    waitAnimation() {
        console.log('starting wait animation')
        if(!this.state.gameStarted) {
            const ledWaitInt = setInterval(() => {
                // console.log('waiting to start...')
                const newPos = (this.state.waitPos + 1) % this.state.lightCount
                // console.log(newPos)
                this.setLedColor(this.state.waitPos, 'white')
                this.setLedColor(newPos, this.state.waitingColors[Math.floor(Math.random()*this.state.waitingColors.length)])
                store.setStore({waitPos: newPos})
            }, 500)
            const dotWaitInt = setInterval(() => {
                const newDots = (this.state.waitingDots + 1) % 4
                store.setStore({waitingDots: newDots})
            }, 800);
            store.setStore({ledWaitInt, dotWaitInt})
        }
    }

    setLedColor(ind, color) {
        let tempColor = store.getStore().lightColor // We need copy not reference and this is an easy way
        tempColor[ind] = color
        store.setStore({lightColor: tempColor})
    }

    movePlayer(dir) {
        console.log(this.state.playerPos)
        if ((this.state.playerPos + dir) >= 0) {
            const newPos = this.state.playerPos + dir
            this.setLedColor(this.state.playerPos, 'white')
            this.setLedColor(newPos, 'lightGreen')
            store.setStore({playerPos: newPos})
        } else {
            console.log('can\'t be less than 0')
        }
    }

    showModal() {
        store.setStore({debugModalShow: 'block', debugLed: true})
    }

    startGame() {
        store.setStore({gameStarted: true})
        clearInterval(this.state.dotWaitInt)
        clearInterval(this.state.ledWaitInt)
        this.clearLeds()
        this.launchListener()
        this.spawnEnemy()
    }

    spawnEnemy() {
        let enemyPos = this.state.lightCount - 3
        store.setStore({enemyPos})
        this.animateEnemy(enemyPos)
    }

    animateEnemy(initPos) {
        this.setLedColor(initPos, 'red')
        let goDown = false
        let enemyArea = 2
        let enemyMoved = 0
        console.log('spawning enemy')
        const enemyInterval = setInterval(() => {
            if (!goDown) {
                const newEnemyPos = this.state.enemyPos + 1
                this.setLedColor(this.state.enemyPos, 'white')
                store.setStore({enemyPos: newEnemyPos})
                this.setLedColor(newEnemyPos, 'red')
                enemyMoved++
                if (enemyMoved === enemyArea) goDown = true
            } else {
                const newEnemyPos = this.state.enemyPos - 1
                this.setLedColor(this.state.enemyPos, 'white')
                store.setStore({enemyPos: newEnemyPos})
                this.setLedColor(newEnemyPos, 'red')
                enemyMoved--
                if (enemyMoved === (-enemyArea)) goDown = false
            }
        }, 500)
        store.setStore({enemyInterval})
    }

    clearLeds() {
        for (let i = 0; i < this.state.lightCount; i++) {
            this.setLedColor(i, 'white')
        }
    }
    
    render() {

        const containerStyle = {
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            padding: "8%"
        }
    
        return (
            <div style={{paddingBottom: "2%"}}>
                <div style={{paddingTop: '8%'}} className="row justify-content-center">
                    <h1>Welcome to WebTwang!</h1>
                </div>
                {!this.state.gameStarted && <div>
                    <div style={{paddingTop: '8%'}} className="row justify-content-center">
                        <h6>Waiting to start{'.'.repeat(this.state.waitingDots)}</h6>
                    </div>
                    <div style={{paddingTop: '1%'}} className="row justify-content-center">
                        <button onClick={socket.connected ? this.startGame.bind(this) : () => {}} type="button" className={socket.connected ? 'btn btn-success btn-lg' : 'btn btn-success btn-lg disabled'}>Start!</button>
                    </div>
                </div>
                }
                <div className='circle-container'>
                {Array(this.state.lightCount).fill("").map((ele, ind) => {
                        return (<a href='#' ><TwangLed key={ind} circle={ind*15} index={ind}/></a>)
                    })}
                </div>
                {/* <div className="" style={containerStyle}>
                    {Array(this.state.lightCount).fill("").map((ele, ind) => {
                        return (<TwangLed key={ind} index={ind}/>)
                    })}
                </div> */}
                <div style={{paddingTop: '1%'}} className="row justify-content-center">
                    <h6>Socket Status:&nbsp;</h6><h6 style={socket.connected ? {color: 'green'} : {color: 'red'}}>{socket.connected ? 'Connected' : 'Not connected!'}</h6>
                </div>
                <div className="row justify-content-center">
                    <p>Lights: {this.state.lightCount}</p>
                </div>
                <div className="row justify-content-center">
                    <button onClick={this.showModal} type="button" className="shadow-lg btn btn-secondary">Debug</button>
                    <DebugModal backgroundClose/>
                </div>
            </div>
        )
    }
}
