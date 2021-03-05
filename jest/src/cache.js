const lStorage = require('./storage')

function setStorage(key, val){
   return lStorage.set(key, val);
}

function getStorage(key){
    return lStorage.get(key);
}


module.exports = {setStorage, getStorage}