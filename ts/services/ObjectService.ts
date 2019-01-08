class ObjectService{
    constructor(){

    }

    /**
     * reindexObject
     * @param {object} object
     */
    reindexObject(object:object): void{
        console.log(object);
    }
}
let data = [
    {id:1, name: 'jedna', index:1},
    {id:2, name: 'dva', index:2},
    {id:3, name: 'tři', index:3},
];

let object1 = new ObjectService();
object1.reindexObject(data);