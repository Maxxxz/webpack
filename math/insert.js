const arr = [51, 60, 22, 81, 0, 63, 54, 22, 3, 99, 12, 25];
let cishu = 0;
function insertSort(arr) {
    const len = arr.length - 1;
    for (let j = 0; j < len; j++) {
        for (let i = j; i >= 0; i--) {
            cishu++;
            if (arr[i] > arr[i + 1]) {
                [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
            }
        }
    }
}

insertSort(arr);
console.log('执行次数：', cishu);
console.log(arr);