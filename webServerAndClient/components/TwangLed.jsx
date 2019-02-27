import React from 'react'

import {store, globalBus} from '../lib/store' // Global Store
import '../assets/css/the.css' // CSS
export default class TwangLed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    
    componentWillMount() {
        this.setState(store.getStore())
    }
    
    componentDidMount() {
        globalBus.on('globalStateUpdate', (data) => {
            this.setState(data)
        })
    }
    
    render() {

        const cellStyle = {
            color: "black",
            fontSize: "10px",
            paddingTop: '17px',
            margin: '2px',
            width: '50px',
            height: '50px',
            backgroundColor: this.state.lightColor[this.props.index],
            borderRadius: '5px',
            boxShadow: "0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)",
            transform: `rotate(${this.props.circle}deg) translate(18em) rotate(-${this.props.circle}deg)`
        }


        return (
            this.props.circle ? (<div style={cellStyle}>{this.state.debugLed && this.props.index}</div>) : <div style={cellStyle}>{this.state.debugLed && this.props.index}</div>
        )
    }
}
