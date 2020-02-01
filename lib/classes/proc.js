/** @module Proc 
 *  
 *
 */

import { Pid }  from    './pid.js'
export { Proc }

/**
 *  @class module:Proc.Proc
 *
 *  @classdesc
 *  Constructor for objects analogous to an [OTP process]{@link
 *  https://erlang.org/doc/getting_started/conc_prog.html#processes}.
 *
 *  @param {module:Serl.Node#name} nodeName
 *
 *  @param {module:Serl.ProcIndex} procIndex 
 *
 *  @param {module:Serl.Node} localNode The [node]{@link module:Serl.Node} which
 *  spawns the new proc, then stores it in its [node.procMap]{@link
 *  module:Serl.Node#procMap}. 
 *
 *  This procMap should be the ONLY direct reference to the process, otherwise
 *  interactions with this process should only occur via send/receive i.e.
 *  message-passing.
 *
 *  @property {Function} toString {@link module:Serl.Proc#toString}
 *
 *  @property {Function} defaultMailHandler {@link module:Serl.Proc#defaultMailHandler}
 *
 *  @property {Function} send {@link module:Serl.Proc#send}
 *
 *  @property {Function} receive {@link module:Serl.Proc#receive}
 *
 *  @property {module:Serl.Node} node Reference to argument passed in
 *  parameter#3; doing this is questionable. To be reviewed. 
 *
 *  @property {module:Serl.NodeIndex} nodeIndex 
 *
 *  @property {module:Serl.Pid} pid Unique identifier for this proc, on this
 *  Node.
 *
 *  @property {Array} mailbox A stack for messages received by this proc.
 *
 *  @property {Function} mailHandler A method which determines how the process
 *  handles messages it receives. This may include storing them in the mailbox,
 *  checking messages already in the mailbox, executing other logic, or simply
 *  ignoring them.
 *
 *  @todo Dependence on localNode is questionable; review.
 *
 *  @todo Do we need to validate argument types here?
 *
 *  @todo Would performance improve if these were static methods? 
 *
 *  @todo 'registered processes'
 *
 */

class Proc {

    constructor (nodeName, procIndex, localNode) {

        /**
        *   @type {module:Serl.Node}
        *   @todo Review, do we want this here?
        */
        this.node           = localNode 

        this.nodeIndex      = Proc.nodeIndexFromNodeName ( localNode, nodeName)
        this.pid            = new Pid (this.nodeIndex, procIndex)
        this.mailbox        = []
        this.mailHandler    = this.defaultMailHandler
    }

    /**
     *  @method module:Serl.Node.nodeIndexFromNodeName
     *  @description 
     *  Utility function, returning a <code>nodeIndex</code>, integers used as
     *  keys in {@link module:Serl.Node#nodeMap}.
     *  
     *  @param {module:Serl.Node} node An instance of the Node class.
     *  @param {module:Serl.Node#name} nodeName
     *  @returns {integer}
     */
    static nodeIndexFromNodeName (node, nodeName) {
        return Array.from( node.nodeMap.keys() )
                    .find( (key) => node.nodeMap.get(key).name == nodeName )
    }

    /**
     *  @method module:Serl.Proc#toString
     *  @description Overridden [toString]{@link
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString}
     *  . Output is of the form:
     *
     *  ```
     *  [object Proc<0.1>]
     *  ```
     *  @todo should this be made into a static method?
     */
    toString () {
        return `[object Proc<${this.pid.nodeIndex}.${this.pid.procIndex}>]`
    }

    /**
     *  @method module:Serl.Proc#defaultMailHandler 
     *  @description When the next message come in, they will be held in
     *  [this.mailbox]{@link module:Serl.Proc#mailbox} in their order of
     *  arrival. No attempt is made to match them to any further logical branches
     *  
     */
    defaultMailHandler ( msg ) {
        //console.log( `    defaultMailHandler received a message` )
        this.mailbox.push ( msg )
    }

    /**
     *  @method module:Serl.Proc#send 
     *  @description Sends a message from this process to another process.
     *
     *  Ultimately executes:
     *
     *  ```
     *  destinationProcess.mailHandler ( validMsg )
     *  ```
     *   
     *  @param {module:Serl.Pid} dest A Pid object which addresses the local or
     *  remote process.
     *   
     *  @param {*} msg The message to be sent to the destination process.
     *  
     *  @todo Validation/Proxy/Reassignment: ensure that nothing is passed by reference.
     *  @todo Validation of <code>dest</code>? 
     *  
     */
    send ( dest, msg ) {

        switch (arguments.length) {
            case 2:
                if ( ! ( dest instanceof Pid ) ) {
                    throw Error (`Proc.send/2 called, first argument was not an
                        instance of Pid`)
                }
                this.node.procMap.get ( dest ).mailHandler ( msg )
                break
            case 3:
                throw Error( 'Proc.send/3 called; no implementation.' )
                break
            default:
                throw Error( 'Proc.send/<1 or >3 called; no implementation.' )
                break
        }

    }

    /**
     *  @method module:Serl.Proc#receive 
     *  @description 
     *  
     *  See [OTP docs]{@link
     *  http://erlang.org/doc/reference_manual/expressions.html#receive}.
     *  
     *  In the body of a function passed to [spawn/n]{@link
     *  module:Serl.Node#spawn}, usage would be in the example below, where
     *  <code>this</code> refers to the [proc]{@link module:Serl.Proc} which was
     *  spawned.
     *
     *  @see
     *  How does a process handle received messages?<br>
     *  Text:           {@link https://erlangbyexample.org/send-receive}<br>
     *  Illustrated:    {@link https://learnyousomeerlang.com/more-on-multiprocessing}
     *
     *  <pre>
     *
     *  When a process receives a message, the message is
     *  appended to the mailbox.
     *
     *  The receive block will try each message in the mailbox (one
     *  by one), against that block's sequence of patterns, until
     *  one of the messages matches a pattern.
     *
     *  When there is match, the message gets removed from
     *  the mailbox and the logic corresponding to the matched pattern
     *  will get executed. If there is no match,
     *  then that message remains in the mailbox, and the following
     *  message gets tried sequentially,
     *  against all of the receive block's patterns.
     *
     *  If no messages in the mailbox match any pattern, the process,
     *  having tried all messages, and having exhausted all receive
     *  patterns, will get suspended until a new message arrives,
     *  and the message processing logic starts all over,
     *  beginning with the first message in the mailbox.
     *  </pre>
     *
     *  @example let awaited = await this.receive( branches )
     *
     *  @todo extend example to include entire call to spawn/n 
     *  @todo typecheck 'branches'? Should be iterable. Currently expects
     *  @todo type: [ [ 'function', 'function'] ]
     *  @todo Perhaps allow type: [ 'function', 'function' ] ?
     *  @todo Perhaps allow type: 'function' where this is just the branch?
     *
     */
    receive ( branches ) {

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
                
                if ( this.mailbox.length ) {
                    this.mailHandler ( this.mailbox.pop() )
                }
                // this.mailHandler has now been customised; if there are any
                // messages in the mailbox, pop the last one, m, then call
                // this.mailHandler on it... ( which pushes m in at the top of
                // the stack, then starts checking through messages from the
                // bottom of the stack for matches in the mailHandler logic.)
                // TODO: review - really not sure if this is a performance leak.
        } )

        //console.log (`NEWS, RECEIVE(): will now return... `)
        return prom
    }
} 
