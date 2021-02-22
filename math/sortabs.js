
function sortABS(n, arr){

    return arr.sort((a, b)=>{
        return Math.abs(a-n) - Math.abs(b-n)
    })
}

sortABS(23, [3, 43, 32,56,54,77,21,6, 12,76,2])
