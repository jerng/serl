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
        this.name   =   `${given}@${this.host}`   
            // TODO: depends on -name vs -sname flags

        this.procMap    =   new Map( [ ] )  
            // Keys are Pid instances, Values are Proc instances
        Object.defineProperty ( this.procMap, 'counter', {  value : 0,
                                                            writable: true } )
            // Making this un-writable would be safer, but more expensive as the
            // value would have to BE RE-CONFIGURed for mutation; and we expect this
            // to change frequently.

        this.nodeMap    =   new Map(    [   [0, { name:this.name }] ] )
            // Discuss: not using an Array, because we follow Erlang convention of
            //          limiting the number of connected nodes in a lifetime; so
            //          keys are the nodeIndex
            //
            //          Here we impose a convention where the local node is index=0


        /*  Distributed Erlang functionality (we don't need this yet) 
         *  https://erlang.org/doc/reference_manual/distributed.html

        let cookie  =   'placeholderCookie'
        let hidden  =   false

         */

    }


    // TODO: implement the 'undefined function' error
    // TODO: refer to 'dynamic module loading' and module objects later 
    spawn () {
        let nodeName, procIndex, newProc, fun
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
                fun         = arguments[0]
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

        newProc     = new Proc ( nodeName, procIndex, this )
        newProc.fun = fun
            // So now, 'this' in fun's body will refer to newProc
        this.procMap.set ( newProc.pid, newProc )

        newProc.fun()
        return newProc.pid

    } // method Node.spawn

} // class Node

export class Proc {
    constructor (nodeName, procIndex, localNode) {

        // Dependence on localNode is questionable; TODO: review

        // TODO: do we need to validate argument types here?

        // TODO: would performance improve if these were static methods? 

        this.nodeIndex      = Node.nodeIndexFromNodeName ( localNode, nodeName)
        this.pid            = new Pid (this.nodeIndex, procIndex)
        this.mailbox        = []
        this.mailHandler    = this.defaultMailHandler
    }
    toString () {
        return `[object Proc<${this.pid.nodeIndex}.${this.pid.procIndex}>]`
    }
    defaultMailHandler ( message ) {
        console.log( `    defaultMailHandler received a message` )
        this.mailbox.push ( message )
            // When the next messages come in, they
            // will be held in this.mailbox in their
            // order of arrival. No attempt is made
            // to match them to any further logical
            // branches.
    }
    receive ( branches ) {

        // TODO: rename 'mailHandler' to mailman, 'branches' 

        // TODO:    typecheck 'branches'?

        console.log (`NEWS, ${this}.RECEIVE(): called`)


//  TODO TODO TODO Somewhere around here, we want to check if the mailbox is
//  empty then run the logic on it.



        let p = new Promise ( (resolve, reject) => {

                // console.log (`NEWS, promiseExec(): called`)
                this.mailHandler = m => {

                    this.mailbox.push ( m )
                        //  New messages are not always evaluated first.

                    //  Oldest messages are always evaluated first.
                    let messageMatched  =   false
                    let messageIndex    =   0
                    check_entire_mailbox: for ( const message of this.mailbox ) {
                        match_message_to_reaction: for ( const r of branches ) {

                            // Essential framework conventions
                            let match   = r[0]
                            let branch  = r[1]

                            if ( match( message ) ) {
                                console.log (`    customised mailHandler() MATCHED a message`)

                                messageMatched = true
                                this.mailbox.splice ( messageIndex, 1 )

                                this.mailHandler = this.defaultMailHandler
                                    // This must be done before resolve() so that
                                    // control is passed back to the proc's fn
                                    // body only after the proc.mailHandler has been
                                    // modified to perform safekeeping.

                                let returnedByBranch = branch (message)
                                
                                console.log(
                                `    returnedByBranch: [[${returnedByBranch}]],
                                typeof ${typeof returnedByBranch}`)

                                resolve (returnedByBranch)
                                //resolve ( branch ( message ) )
                                    // Promise Resolved
                                
                                break check_entire_mailbox
                            }
                            console.log (`    customised mailHandler() tried to match a
                                message; failed`)
                        }
                        messageIndex ++ 
                    }
                    if ( messageMatched ) {
                        // res ( m ) 
                    } else {
                        console.log (`    customised mailHandler() tried to match a
                            message; failed all`)
                        // leave m in the mailbox, do not resolve; do not
                        // reject; if we need to reject, then we need to add
                        // another promise around this one...
                    }
                }

                        // if you call proc.receive( x ),   OK
                        // then x will be pushed
                        // into proc.mailbox,               OK
                        // and proc.receive will
                        // resolve its promise that is being awaited in proc's
                        // function body... and the logic in proc's function
                        // body will proceed...             OK 
        } )

        //console.log (`NEWS, RECEIVE(): will now return... `)
        return p
    }
        /*  Text:           https://erlangbyexample.org/send-receive
            Illustrated:    https://learnyousomeerlang.com/more-on-multiprocessing
        
        How does a process handle received messages?

        When a process receives a message, the message is
        appended to the mailbox.

        The receive block will try each message in the mailbox (one
        by one), against that block's sequence of patterns, until
        one of the messages matches a pattern.

        When there is match, the message gets removed from
        the mailbox and the logic corresponding to the matched pattern
        will get executed. If there is no match,
        then that message remains in the mailbox, and the following
        message gets tried sequentially,
        against all of the receive block's patterns.

        If no messages in the mailbox match any pattern, the process,
        having tried all messages, and having exhausted all receive
        patterns, will get suspended until a new message arrives,
        and the message processing logic starts all over,
        beginning with the first message in the mailbox.

        */
} 
    // TODO: 'registered processes'
    

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
