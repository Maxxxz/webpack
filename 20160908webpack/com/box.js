/*
 *  max 20160919
 */

import React from 'react';

class Box extends React.Component {
    constructor(props){
        super(props);
    }

    state : {
            height:150,
            width:150,
            Bcolor:'#eee'
    }

    render() {
        let fstate = this.props;
        fstate = Object.assign({}, this.state, fstate);
        this.setState(fstate);
        
        return <div style={{height:this.state.height,width:this.state.width,backgroundColor:this.state.color}}></div>
    }
}