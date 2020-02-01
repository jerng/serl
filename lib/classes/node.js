/** @module Node 
 *  
 *
 */

import { Proc } from        './proc.js'
import { ProcMap } from     './procMap.js'
import * as SSON from       '../sson/sson.js'

export { Node }

/**
 *  @class module:Node.Node
 *
 *  @classdesc
 *  Constructor for objects analogous to an [OTP node]{@link
 *  https://erlang.org/doc/reference_manual/distributed.html#nodes}.
 *
 *  @param {String} given Following OTP convention, a [node name]{@link
 *  https://erlang.org/doc/reference_manual/distributed.html#nodes}, 
 *  names should be 'given@host'.
 *
 *  @property {Function} nodeIndexFromNodeName {@link
 *  module:Serl.Node.nodeIndexFromNodeName}
 *
 *  @property {Function} spawn {@link
 *  module:Serl.Node#spawn}
 *
 *  @property {module:Serl.Node#host} host Should mirror OTP convention, presumably refer
 *  to a hostfile.
 *
 *  @property {module:Serl.Node#name} name 
 *
 *  @property {Map} procMap 
 *
 *  @property {Map} nodeMap A map of connected nodes.
 *
 *  @todo Rename module from Serl to OTP? (Brand reinforcement; possibly
 *  conveying a sense of false legitimacy.)
 *
 *  @todo Distributed Erlang functionality (we don't need this yet) 
 *  https://erlang.org/doc/reference_manual/distributed.html
 *
 *  @property cookie todo/unimplemented
 *  @property hidden todo/unimplemented
 */

class Node {

    constructor (given) {

        /** 
        *   @property module:Serl.Node#host 
        *   @type {String}
        *   @todo Assign from a hostfile.
        *   @description This custom type exists only in documentation, and must
        *   be manually enforced in code, by developers.
        *   
        */
        this.host   =   'placeholderHost'

        /** 
        *   @property module:Serl.Node#name 
        *   @type {String}
        *   @todo In OTP convention, this depends on -name vs -sname flags
        *   @description Has the form <code>given@host</code>, which is based on
        *   the given-name of each call to <code>Node(given)</code>. Analogous
        *   to an OTP [node name]{@link
        *   https://erlang.org/doc/reference_manual/distributed.html#nodes}
        *
        *   This custom type exists only in documentation, and must
        *   be manually enforced in code, by developers.
        *   
        */
        this.name   =   `${given}@${this.host}`   

        /** 
        *   @namespace module:Serl.'Node#procMap'
        *
        *   @description A map of a node's local processes (any instances of
        *   [Proc]{@link module:Serl.Node.Proc} which were created by calling
        *   [spawn/n]{@link module:Serl.Node.spawn} on that node.
        *   Here we use a Map, because we anticipate frequent
        *   lookups based on given [Pid]{@link module:Serl.Pid}s. We also expect
        *   'frequent additions and removals of key-value pairs'
        *
        *   @property {module:Serl.Pid} @keys Keys in the Map should be
        *   {@link module:Serl.ProcMap} 
        *
        *   @property {module:Serl.Proc} @values Values in the Map should be
        *   instances of this class.
        *
        *   @property {module:Serl.ProcIndex} counter {@link
        *   module:Serl.'Node#procMap'.counter}
        *
        *   @todo update docs to remind developers to enforce
        *   nodeIndex = parseInt(nodeIndex).
        *
        *   @todo Should ProcMap have its own class? 
        */
        this.procMap    =   new ProcMap ()  
        
        /**
        *   @property module:Serl.'Node#procMap'.counter
        *
        *   @memberof module:Serl.'Node#procMap'
        *
        *   @description This helps us avoid duplicate process-indices on the
        *   local node, when generating a Pid object. We want to use Map here,
        *   because we expect 'frequent additions and removals of key-value
        *   pairs'
        * 
        *   Each node must track all its previously spawned processes, and so we
        *   want an incrementing [Node.procMap.counter]{@link
        *   module:Serl.'Node#procMap'.counter}, to ensure that for the lifetime
        *   of a node, N, all of N's local processes have a unique ProcIndex. 
        * 
        *   In the current implementation, the upper limit seems to simply be
        *   the size of Node.procMap.counter. (In Erlang, the equivalent number
        *   is stored in 18 to 28 bits, after which numbers are reused...
        *   however in JavaScript, it seems we have almost 53 bits...)
        * 
        */
        this.procMap.counter = 0

        /** 
        *   @namespace module:Serl.'Node#nodeMap'
        *
        *   @description A map of a node's known (currently connected, and
        *   previously connected)) nodes, including itself. 
        *   Here we use a Map, because we anticipate frequent
        *   lookups based on given [NodeIndex]{@link module:Serl.NodeIndex}s. We
        *   also expect 'frequent additions and removals of key-value pairs'
        *   
        *   @property {module:Serl.NodeIndex} @keys Keys in the Map should be
        *   of this type.
        *
        *   @property { described } @values Values in the Map should be
        *    of the form <code>{ name: [NodeName]{@link module:Serl.Node#name}
        *   }</code>. 

        *
        *   @property {Serl.NodeIndex} counter {@link
        *   module:Serl.'Node#nodeMap'.counter}
        *
        *   @todo Add nodeMap.counter to make this consistent with
        *   procMap.counter; update docs to remind developers to enforce
        *   nodeIndex = parseInt(nodeIndex).
        *
        *   @todo Values should have their own class.
        *
        *   @todo Should NodeMap have its own class? 
        */
        this.nodeMap    =   new Map(    [   [0, { name:this.name }] ] )

        /**
        *   @property module:Serl.'Node#nodeMap'.counter
        *
        *   @memberof module:Serl.'Node#nodeMap'
        *
        *   @description This helps us avoid duplicate {@link Serl.NodeIndex}s on the
        *   local node, when generating a [Pid]{@link module:Serl.Pid}. 
        *
        *   Each node must track all previously known nodes, and so we want an
        *   incrementing counter, to ensure that for any single
        *   lifetime of a node, N, every other node that ever connects to N, has a
        *   unique NodeIndex from N's point of view. 
        * 
        *   In the current implementation, the upper limit of trackable nodes connected
        *   to N in one lifetime seems to simply be the size of Node.nodeMap.counter.
        *   Here we impose a convention where the local node is index=0
        *
        */
        this.nodeMap.counter = 0

    }


    /**
     *  @method module:Serl.Node#spawn
     *
     *  @description Implements various arities of spawn/n.
     *  Spawns an instance of [Proc]{@link module:Serl.Proc} on some a certain
     *  instance of [Node]{@link module:Serl.Node}. The keyword
     *  <code>this</code> in any <code>fun</code> passed to spawn/n will refer
     *  to the spawned <code>proc</code>.
     *      
     *  > #### <span style="color:red;">**WARNING: Pass-by-value Only**</span>
     *  >
     *  > **Introduction to Concern:** 
     *  >
     *  > This method is fundamental to OTP resourcing paradigms, specifically the
     *  > notion that 'zero memory is shared'. So if you pass in anything by
     *  > reference (objects... includng function objects, and array objects) then
     *  > you break OTP conventions. 
     *  >
     *  > **Working Conclusion:** 
     *  >
     *  > See (2) below.
     *  >
     *  > **Discussion:** 
     *  >
     *  > As of 2019, there exists much active discussion
     *  [[1](https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)] about the absence of a
     *  > canonical deep-clone method in JavaScript. Yet even the HTML5
     *  > specified [structured clone
     *  algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
     *  > doesn't handle function objects. Using a third-party library forces a
     *  > dependency upon Serl, so we're avoiding this path. Two options remain:
     *  > <ol>
     *  >   <li>Leave Serl-users to handle reference-removal</li>
     *  >   <li>Write a Serl-specific cloning method</li>
     *  > </ol>
     *  >
     *  >
     *  > | <span style="background-color:#fcc;">The Case for (1)</style> | <span style="background-color:#cfc;">The Case for (2)</style> |
     *  > |------------------|------------------|
     *  > | <p>The minimal approach is to do nothing. In this approach, passing-by-value only would be managed by the user/developer. Following OTP convention, developers should not design programs to require a large datum to be passed as an argument.  </p> <p>Yet under this approach, should we conduct a partial clone, as is the case with most cloning libraries, or should we attempt to fully clone methods as well? Well, it turns out that we can't ignore functions since even spawn/1 is called on a function, which needs to be unreferenced from anywhere else.</p> <p>So if we're going to implement function cloning, then we might as well proceed to (2)...</p> | <p>This extensive approach increases the probability that Serl is actually used correctly. Since correctness in terms of following OTP protocols is the point of Serl, we now embark on this track.</p>
     *  >
     *  >
     *  >
     *  
     *
     *  ##### spawn/1
     *  Spawns a Proc object on the parent node, which applies
     *  <code>fun</code> to an empty array <code>[]</code>. See
     *  <a href="http://erlang.org/doc/man/erlang.html#spawn-1">OTP docs</a>.
     *
     *  ###### Parameters:
     *
     *  | Name  | Type | Description |
     *  |-------|------|-------------|
     *  | fun | Function |The function which will run in this process. 
     *
     *  ##### spawn/2
     *  (coming soon)
     *
     *  ##### spawn/3
     *  Spawns a Proc object on the parent node, which applies a function (given and
     *  accessed via a module) to a list of arguments, in the manner of:
     *
     *  ```
     *  module[funName]( ... funArgs )</code>
     *  ```
     *  See 
     *  <a href="http://erlang.org/doc/man/erlang.html#spawn-3">OTP docs</a>.
     *  ###### Parameters:
     *
     *  | Name  | Type | Description |
     *  |-------|------|-------------|
     *  | module | Object | An object representing a code Module, with callable methods.
     *  | funName | String | The string name of a method of <code>module</code>. 
     *  | funArgs | Array | An array of arguments to pass to <code>module[funName]</code> when the latter is called. 
     *
     *  ##### spawn/4
     *  (coming soon)
     *
     *  @todo implement the 'undefined function' error
     *  @todo refer to 'dynamic module loading' and module objects later 
     *  @todo When <code>fun</code> returns, Proc should exit formally.
     *  @todo Enforce passing objects by value (copy on call).
     *  
     */

    spawn () {

        let nodeName, 
            procIndex, 
            newProc, 
            module, 
            fun, funArgs, stringifiedFun,
            parsedFun, stringifiedFunArgs, parsedFunArgs

        switch (arguments.length) {
            case 0:
                throw Error( 'Node.spawn/0 called; no implementation.' )
                break

            case 1:

                if ( typeof arguments[0] != 'function' ) { 
                    throw Error( 'Node.spawn/1 called with a non-function' ) 
                }

                nodeName        = this.name
                procIndex       = ++this.procMap.counter
                fun             = arguments[0]

                stringifiedFun  = JSON.stringify    ( fun, SSON.replacer )
                parsedFun       = JSON.parse        ( stringifiedFun, SSON.reviver )

                newProc         = new Proc ( nodeName, procIndex, this )
                newProc.fun     = parsedFun

                this.procMap.set ( newProc.pid, newProc )
                newProc.fun([])
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

                if ( typeof arguments[1] != 'string' ) { 
                    throw Error( `Node.spawn/3, arguments[1] called with a
                        non-string (expecting the method name as a string` ) 
                }

                if ( ! Array.isArray( arguments[2] ) ) { 
                    throw Error( `Node.spawn/3, arguments[2] called with a
                        non-array (expecting arguments for fun as an array)` ) 
                }

                nodeName        = this.name
                procIndex       = ++this.procMap.counter
                module          = arguments[0]
                fun             = module[arguments[1]]
                funArgs         = arguments[2]

                stringifiedFun      = JSON.stringify    ( fun,                  SSON.replacer )
                parsedFun           = JSON.parse        ( stringifiedFun,       SSON.reviver )
                stringifiedFunArgs  = JSON.stringify    ( funArgs,              SSON.replacer )
                parsedFunArgs       = JSON.parse        ( stringifiedFunArgs,   SSON.reviver )

                newProc     = new Proc ( nodeName, procIndex, this )
                newProc.fun = parsedFun

                this.procMap.set ( newProc.pid, newProc )
                newProc.fun ( ... parsedFunArgs )
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
