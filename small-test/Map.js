var m = new Map([[1],[3,4]])
console.log(m);
m.set('a', 1);
m.set(undefined, undefined);
m.set('a', 2);
console.log(m);
console.log([...m.values()])

function filters(arr){
    return arr.filter((val, index)=> arr.indexOf(val) === index)
}
console.log(filters([1,2,3,1,3,undefined, null, 4, undefined]))

