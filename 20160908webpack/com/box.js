/*
 *  max 20160919
 */

import React from 'react';

class Box extends React.Component {
    constructor(props){
        super(props);

        // this.state = {   //ES6写里面
        //     'height':150,
        //     'width':150,
        //     'Bcolor':'#EEE'
        // }
    }
    
    state = {       //ES7的写法，webpack需要装stage-0。
        'height':150,
        'width':150,
        'Bcolor':'#EEE'
    }

    // state : {       //这样写state不是挂在类里的。所以this.satate获取不到。
    //     'height':150,
    //     'width':150,
    //     'Bcolor':'#EEE'
    // }

    componentWillMount(){
        let fstate = this.props;   
        this.setState(Object.assign({}, this.state, fstate));
    }
    
    render() {
        return <div style={{height:this.state.height,width:this.state.width,backgroundColor:this.state.Bcolor}}></div>
    }
}

export default Box;