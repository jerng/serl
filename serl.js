/* serl.js should be serl.mjs - but the lousy dev server doesn't serve the right
 * mime type 

 */

'use strict'

// This is chosen over an (export default) expression for explicitness:
export class Node {
    constructor (given) {
        this.host   =   'placeholderHost'
        this.name   =   `${given}@${this.host}`   // TODO: depends on -name vs -sname flags

        /*  Distributed Erlang functionality (we don't need this yet) 
         *  https://erlang.org/doc/reference_manual/distributed.html

        let cookie  =   'placeholderCookie'
        let hidden  =   false

         */

        this.spawn  = () => {}
    }
}

export class Pid {
    constructor () {
    }
}

