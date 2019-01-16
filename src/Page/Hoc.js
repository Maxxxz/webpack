import React, { Component } from 'react';

const MyFuncComponent = (props)=>{
    return (
        <div>Hello World MyFuncComponent</div>
    );
}

class MyClassComponent extends Component{

    render(){
        return (
          <>
            <div>Hello World MyClassComponent</div>
            <MyFuncComponent />
          </>
        )
    }

}

class WrappedComponent extends Component{
    render(){
        return(
            <div>
                <div>
                    <span>Hello World</span>
                </div>
                <MyClassComponent />
            </div>

        )
    }
}

const HOC = (WrappedComponent) =>
    class extends WrappedComponent {
        render() {
            const elementsTree = super.render();
            console.log('elementsTree', elementsTree)
            return elementsTree;
        }
    }

export default HOC(WrappedComponent);
