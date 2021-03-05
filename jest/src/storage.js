module.exports = {
    get: key => localStorage.getItem(key),
    set: (key, val) => {
        console.log('localStorage.setItem', localStorage.setItem)
        localStorage.setItem(key, val)
        return val
    },
    remove: key => localStorage.removeItem(key)
}