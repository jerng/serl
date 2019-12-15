/* serl.js should be serl.mjs - but the lousy dev server doesn't serve the right
 * mime type 

 */

'use strict'

// This is chosen over an (export default) expression for explicitness:
//
export class Node {
    static nodeIndexFromNodeName (node, nodeName) {
        return Array.from( node.nodeMap.keys() )
                    .find( (key) => node.nodeMap.get(key).name == nodeName )
    }
    constructor (given) {
        this.host   =   'placeholderHost'
        this.name   =   `${given}@${this.host}`   // TODO: depends on -name vs -sname flags

        this.procMap    =   new Map( [ ] )
        Object.defineProperty ( this.procMap, 'counter', {  value : 0,
                                                            writable: true } )
        // Making this un-writable would be safer, but more expensive as the
        // value would have to BE RE-CONFIGURed for mutation; and we expect this
        // to change frequently.

        // Discuss: not using an Array, because we follow Erlang convention of
        //          limiting the number of connected nodes in a lifetime; so
        //          keys are the nodeIndex
        //
        //          Here we impose a convention where the local node is index=0
        this.nodeMap    =   new Map(    [   [0, { name:this.name }] 
                                        ] )


        /*  Distributed Erlang functionality (we don't need this yet) 
         *  https://erlang.org/doc/reference_manual/distributed.html

        let cookie  =   'placeholderCookie'
        let hidden  =   false

         */

    }


    // TODO: implement the 'undefined function' error
    // TODO: refer to 'dynamic module loading' and module objects later 
    spawn () {
        let nodeName, procIndex, newProc
        switch (arguments.length) {
            case 0:
                throw Error( 'Node.spawn/0 called; no implementation.' )
                break

            case 1:

                //  http://erlang.org/doc/man/erlang.html#spawn-1
                //  Expect a function.
                if ( typeof arguments[0] != 'function' ) { 
                    throw Error( 'Node.spawn/1 called with a non-function' ) 
                }

                nodeName    = this.name
                procIndex   = ++this.procMap.counter
                break

            case 2:
                throw Error( 'Node.spawn/2 called; no implementation.' )
                break
            case 3:
                throw Error( 'Node.spawn/3 called; no implementation.' )
                break
            case 4:
                throw Error( 'Node.spawn/4 called; no implementation.' )
                break
            case 5:
                throw Error( 'Node.spawn/5 called; no implementation.' )
                break
            default:
                throw Error( 'Node.spawn/(>5) called; no implementation.' )
        }
        newProc = new Proc ( nodeName, procIndex, this )
        return newProc.pid

    } // method Node.spawn

} // class Node

export class Proc {
    // Dependence on localNode is questionable; TODO: review
    constructor (nodeName, procIndex, localNode) {
        // TODO: do we need to validate argument types here?
        this.nodeIndex  = Node.nodeIndexFromNodeName ( localNode, nodeName)
        this.pid = new Pid (this.nodeIndex, procIndex)
    }
    toString () {
        return `[object Proc<${this.pid.nodeIndex}.${this.pid.procIndex}>]`
    }
} 

export class Pid {
    constructor (nodeIndex, procIndex) {
        // TODO: do we need to validate argument types here?
        this.nodeIndex  = nodeIndex
        this.procIndex  = procIndex
    }
    toString () {
        return `[object Pid<${this.nodeIndex}.${this.procIndex}>]`
    }
} 

// TODO: export class Reference ()
