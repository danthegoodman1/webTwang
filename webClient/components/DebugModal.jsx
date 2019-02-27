import React from 'react'
import {store, globalBus} from '../lib/store'
import '../assets/css/the.css'


export default class DebugModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.decideClose = this.decideClose.bind(this)
    }

    componentWillMount() {
        this.setState(store.getStore())
    }

    componentDidMount() {
        globalBus.on('globalStateUpdate', (data) => {
            this.setState(data)
        })
    }

    showModal() {
        store.setStore({debugModalShow: 'block'})
    }

    closeModal() {
        store.setStore({debugModalShow: 'none'})
    }

    decideClose() {
        if(this.props.backgroundClose) {
            this.closeModal()
        }
    }

    render() {
        return (
            <div>
                {/* put prop here to see if we can click background to close */}
                <div onClick={this.decideClose} className="modal" id="debugModal" style={{display: this.state.debugModalShow}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Global State Debug Modal</h5>
                            <button onClick={this.closeModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{wordWrap: 'break-word'}}>
                            <p>{JSON.stringify(this.state)}</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.closeModal} type="button" className="btn btn-secondary shadow" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="modal" id="myModal">
                    <div className="modal-dialog">
                    <div className="modal-content">
                    
                        <div className="modal-header">
                        <h4 className="modal-title">Modal Heading</h4>
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        
                        <div className="modal-body">
                        Modal body..
                        </div>
                        
                        <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                        
                    </div>
                    </div>
                </div>
            </div>
        )
    }

}
