/**
 * HelloWorld类存储一位客人的名字，并打招呼。
 */
class HelloWorld {

    constructor(){
        this.firstName = '';
        this.lastName = '';
    }

    /**
     * 设置客人的姓名
     *
     * @param {String} lastName 姓
     * @param {String} firstName 名
     */
    setName(lastName, firstName){
        this.lastName = lastName;
        this.firstName = firstName;
    }

    /**
     * 获取客人的全名
     *
     * @return {String} 客人的姓名
     */
    getFullName(){
        return this.lastName + ' ' + this.firstName;
    }

    /**
     * 向客人打招呼
     *
     */
    sayHello(){
        console.log('Hello, ' + this.getFullName());
    }
}