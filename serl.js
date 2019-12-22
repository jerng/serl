/** @module
 *  @name Serl
 *  @summary Currently the only source file.
 *
 *  @description 
 *  'export class/function' chosen over an (export default) expression for explicitness:
 *
 *  @todo Check each METHOD... should it be .STATIC or #INSTANCE? 
 *
 *  @todo Proxy the 'console' object so that we can toggle debug levels
 *
 *  @todo serl.js should be serl.mjs - but the lousy dev server doesn't serve the right
 *  mime type 
 *
 *  @todo https://docsify.js.org/#/quickstart ?
 */

'use strict'

/**
 *  @class module:Serl.Node
 *  @classdesc
 *  Constructor for objects analogous to an OTP node.
 */
export class Node {

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

    /**
     *  @method module:Serl.Node.nodeIndexFromNodeName
     *  @description 
     *  Utility function
     *  
     */
    static nodeIndexFromNodeName (node, nodeName) {
        return Array.from( node.nodeMap.keys() )
                    .find( (key) => node.nodeMap.get(key).name == nodeName )
    }


    /**
     *  @method module:Serl.Node#spawn
     *  @description todo 
     *  @todo implement the 'undefined function' error
     *  @todo refer to 'dynamic module loading' and module objects later 
     */
    spawn () {
        let nodeName, procIndex, newProc, module, fun, funArgs
        switch (arguments.length) {
            case 0:
                throw Error( 'Node.spawn/0 called; no implementation.' )
                break

            case 1:

                //  http://erlang.org/doc/man/erlang.html#spawn-1

                if ( typeof arguments[0] != 'function' ) { 
                    throw Error( 'Node.spawn/1 called with a non-function' ) 
                }
                    //  Expect a function.

                nodeName    = this.name
                procIndex   = ++this.procMap.counter
                fun         = arguments[0]

                newProc     = new Proc ( nodeName, procIndex, this )
                newProc.fun = fun
                    // So now, 'this' in fun's body will refer to newProc

                this.procMap.set ( newProc.pid, newProc )
                newProc.fun()
                break

            case 2:
                throw Error( 'Node.spawn/2 called; no implementation.' )
                break
            case 3:
                //  http://erlang.org/doc/man/erlang.html#spawn-3

                if ( typeof arguments[0] != 'object' ) { 
                    throw Error( `Node.spawn/3, arguments[0] called with a
                        non-object (expecting the module-object)` ) 
                }
                    //  TODO: how do we further test for MODULE  objects?

                if ( typeof arguments[1] != 'string' ) { 
                    throw Error( `Node.spawn/3, arguments[1] called with a
                        non-string (expecting the method name as a string` ) 
                }
                    //  Expect a function.

                if ( ! Array.isArray( arguments[2] ) ) { 
                    throw Error( `Node.spawn/3, arguments[2] called with a
                        non-array (expecting arguments for fun as an array)` ) 
                }
                    //  Expect an Array.

                nodeName        = this.name
                procIndex       = ++this.procMap.counter
                module          = arguments[0]
                fun             = module[arguments[1]]
                funArgs    = arguments[2]

                newProc     = new Proc ( nodeName, procIndex, this )
                newProc.fun = fun
                    // So now, 'this' in fun's body will refer to newProc

                this.procMap.set ( newProc.pid, newProc )
                newProc.fun ( ... funArgs )
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

        return newProc.pid

    } // method Node.spawn

} // class Node

/**
 *  @class module:Serl.Proc
 *  @classdesc
 *  Constructor for objects analogous to an OTP process.
 */
export class Proc {

    constructor (nodeName, procIndex, localNode) {

        // Dependence on localNode is questionable; TODO: review

        // TODO: do we need to validate argument types here?

        // TODO: would performance improve if these were static methods? 

        this.node           = localNode // TODO: review, do we want this here?
        this.nodeIndex      = Node.nodeIndexFromNodeName ( localNode, nodeName)
        this.pid            = new Pid (this.nodeIndex, procIndex)
        this.mailbox        = []
        this.mailHandler    = this.defaultMailHandler
    }

    /**
     *  @method module:Serl.Proc#toString
     *  @description 
     *  todo 
     *  
     */
    toString () {
        return `[object Proc<${this.pid.nodeIndex}.${this.pid.procIndex}>]`
    }

    /**
     *  @method module:Serl.Proc#defaultMailHandler 
     *  @description 
     *  todo 
     *  
     */
    defaultMailHandler ( msg ) {
        //console.log( `    defaultMailHandler received a message` )
        this.mailbox.push ( msg )
            // When the next messages come in, they
            // will be held in this.mailbox in their
            // order of arrival. No attempt is made
            // to match them to any further logical
            // branches.
    }

    /**
     *  @method module:Serl.Proc#send 
     *  @description 
     *  todo 
     *  
     */
    send ( dest, msg ) {
        // TODO: we need to validate all first parameter arguments

        switch (arguments.length) {
            case 0:
                throw Error( 'Proc.send/0 called; no implementation.' )
                break
            case 1:
                throw Error( 'Proc.send/1 called; no implementation.' )
                break
            case 2:
                if ( ! ( dest instanceof Pid ) ) {
                    throw Error (`Proc.send/2 called, first argument was not an
                        instance of Pid`)
                }
                //console.log(`    ${this}.send/2: supposed to send a message to ${dest}`)
                this.node.procMap.get ( dest ).mailHandler ( msg )
                 
                break
            default:
                throw Error( 'Proc.send/>2 called; no implementation.' )
                break
        }

    }

    /**
     *  @method module:Serl.Proc#receive 
     *  @description 
     *  todo 
     *  
     */
    receive ( branches ) {

        // TODO: rename 'mailHandler' to mailman?

        // TODO:    typecheck 'branches'? Should be iterable. Currently expects
        //          type: [ [ 'function', 'function'] ]
        //
        //          Perhaps allow type: [ 'function', 'function' ] ?
        //          Perhaps allow type: 'function' where this is just the branch?

        //console.log (`NEWS, ${this}.RECEIVE(): called`)

        let prom = new Promise ( (resolve, reject) => {

                // console.log (`NEWS, promiseExec(): called`)
                this.mailHandler = m => {

                    this.mailbox.push ( m )
                        //  New messages are not always evaluated first.

                    //  Oldest messages are always evaluated first.
                    let messageMatched  =   false
                    let messageIndex    =   0
                    check_entire_mailbox: for ( const msg of this.mailbox ) {
                        match_message_to_reaction: for ( const b of branches ) {

                            // Essential framework conventions
                            let match   = b[0]
                            let branch  = b[1]

                            if ( match ( msg ) ) {
                                //console.log (`    customised mailHandler() MATCHED a message`)

                                messageMatched = true
                                this.mailbox.splice ( messageIndex, 1 )

                                this.mailHandler = this.defaultMailHandler
                                    // This must be done before resolve() so that
                                    // control is passed back to the proc's fn
                                    // body only after the proc.mailHandler has been
                                    // modified to perform safekeeping.

                                let returnedByBranch = branch ( msg )
                                
                                //console.log(
                                //`    returnedByBranch: [[${returnedByBranch}]],
                                //typeof ${typeof returnedByBranch}`)

                                resolve (returnedByBranch)
                                    // Promise Resolved
                                
                                break check_entire_mailbox
                            }
                            //console.log (`    customised mailHandler() tried to match a
                            //    message; failed`)
                        }
                        messageIndex ++ 
                    }
                }
                // if you call proc.receive( x ),   OK
                // then x will be pushed
                // into proc.mailbox,               OK
                // and proc.receive will
                // resolve its promise that is being awaited in proc's
                // function body... and the logic in proc's function
                // body will proceed...             OK 
                
                if ( this.mailbox.length ) {
                    this.mailHandler ( this.mailbox.pop() )
                }
                // this.mailHandler has now been customised, if there are any
                // messages in the mailbox, pop the last one, m, then call
                // this.mailHandler on it... ( which pushes m in at the top of
                // the stack, then starts checking through messages from the
                // bottom of the stack for matches in the mailHandler logic.)
                // TODO: review - really not sure if this is a performance leak.
        } )

        //console.log (`NEWS, RECEIVE(): will now return... `)
        return prom
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
    

/**
 *  @class module:Serl.Pid
 *  @classdesc
 *  Constructor for objects analogous to an OTP Pid term.
 */
export class Pid {

    constructor (nodeIndex, procIndex) {
        // TODO: do we need to validate argument types here?
        this.nodeIndex  = nodeIndex
        this.procIndex  = procIndex
    }

    /**
     *  @method module:Serl.Pid#toString
     *  @description 
     *  todo 
     *  
     */
    toString () {
        return `[object Pid<${this.nodeIndex}.${this.procIndex}>]`
    }
} 

/**
 *  @function module:Serl.recurse
 *  @description Utility function that helps reduce boilerplate in spawn/n for
 *  recursing functions. 
 */
export function recurse ( fun, funArgs ){
    // 'function' in expression needed, for 'this' in body

    let utilRecursive =   async ( _fun, _funArgs ) => { 
        // 'async' in expression needed, for 'await' in body

        let utilRecursiveAwaited    =   await _fun.apply ( this, _funArgs ) 
            // value of 'this' is inherited from surrounding scope;
            //
            // So, if 'recurse' is spawn/n-ed on a new Proc, then the context is
            // proc.recurse, and so 'this' would point to 'proc'. (see the
            // source for Node.spawn/n

        // TODO: utilRecursiveAwaited's return value is not used, but 
        // it could be used to replace the default _funArgs

        utilRecursive ( _fun, _funArgs ) 
    } 
    utilRecursive ( fun, funArgs ) 
} 
// TODO: make 'recurse' work with all arities of spawn/n


// TODO: export class Reference ()
