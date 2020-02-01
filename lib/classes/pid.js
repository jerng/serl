/** @module Pid 
 *  
 *
 */

export { Pid }

/**
 *  @class module:Serl.Pid
 *  @classdesc
 *  Constructor for objects analogous to an [OTP Pid term]{@link
 *  http://erlang.org/doc/reference_manual/data_types.html#pid}.
 *
 *  @todo validate argument types in the constructor!
 *
 */
class Pid {

    constructor (nodeIndex, procIndex) {
        this.nodeIndex  = nodeIndex
        this.procIndex  = procIndex
    }

    /**
     *  @method module:Serl.Pid#toString
     *  @description Overridden [toString]{@link
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString}
     *  . Output is of the form:
     *
     *  ```
        *  [object Pid<0.1>]
     *  ```
     *  @todo should this be made into a static method? (no)
     *  
     */
    toString () {
        return `[object Pid<${this.nodeIndex}.${this.procIndex}>]`
    }

} 

