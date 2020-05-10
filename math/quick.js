// 快速排序
// 占用了大量的空间
// const arr = [51, 60, 22, 81, 0, 63, 54, 22, 3, 99, 12, 25];

const arr = [51, 3, 5, 7, 0, 63, 54, 70, 9, 99, 88, 80];
let cishu = 0;
function quickSort1(arr) {
    arr = arr.concat([]);
    if (arr.length <= 1) {
        return arr;
    }
    let flag = arr.shift(0);
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++) {
        cishu++;
        if (arr[i] <= flag) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort1(left).concat(flag, quickSort1(right));
}

const res1 = quickSort1(arr);
console.log('执行次数：', cishu);
console.log(res1);

// 原地快排
cishu = 0;
function quickSort2(arr, low = 0, high = arr.length - 1) {
    if (low >= high) return;
    let left = low;
    let right = high;
    let temp = arr[left];
    console.log('temp left right', temp);
    while (left < right) {
        if (left < right && temp <= arr[right]) {
            right--;
        }

        if (left < right && temp >= arr[left]) {
            left++;
        }

        if (left < right && arr[right] < temp && arr[left] > temp) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            right--;
            left++;
        }
        console.log(left, right, arr);
    }
    arr = arr.splice(low, 1);
    arr = arr.splice(left, 0, temp);
    console.log('arr once', arr);
    quickSort2(arr, low, left - 1);
    quickSort2(arr, left + 1, high);
    return arr;
}
console.log('arr ori', arr);
const res2 = quickSort2(arr);
console.log('执行次数2：', cishu);
console.log(res2);
