import {createStore} from 'redux'
import getStatus from '../reducers/index.js'

export default function manStore(action){
  return createStore(getStatus,action); // 初始化创建
}