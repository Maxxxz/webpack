/**
 * @description 求两个数的和<br />
 * 1) 参数将强制转换为Number类型<br />
 * 2) 这是一个全局的公用方法
 * @method add
 * @param {Number} num1 数1
 * @param {Number} num2 数2
 * @return {Number} 数1和数2的和
 * @since 2013-08-04
 * @author maxi
 * @example
 * var sum = add(3,5); <br />
 * alert(sum); // 8
 * @static
 */
export function add(num1, num2) {
    return Number(num1) + Number(num2);
}


/**
 * Assign the project to an employee.
 * @description 看人的名字<br />
 * 1) 123<br />
 * 2) 456
 * @method show
 * @since 2013-08-04
 * @author maxi
 * @param {Object} person - The employee who is responsible for the project.
 * @param {string} person.name - The name of the employee.
 * @param {string} person.host - The employee's host.
 * @param {string} orgin
 * @tryNow true
 */
export function show(person, orgin) {
    return person.name + person.host + orgin;
}
