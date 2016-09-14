// import { combineReducers } from 'redux'
// import todos from './todos'
// import visibilityFilter from './visibilityFilter'

// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// })

// export default todoApp


/*
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp;
注意上面的写法和下面完全等价：

export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)   //还顺便给state做了拆分！
  }
}
*/
import {zxx, mao} from '../action/index'

// 定义初始化状态，初始化状态是常量
// 初始状态是红灯
const initState = {
  content:'hehe'
}


// 定义灯转换的reducer函数
export default function getStatus(state=initState, action){
  switch(action.type){
    case zxx:
      return {
        num:11,
        content:'stillhere'
      }

    case mao:
      return {
        content:'justleave'
      }

    default:
      return state
  }
}