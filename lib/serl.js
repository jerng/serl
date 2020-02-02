/** @module Serl
 *
 *  @summary This module aggregates various submodules which enable the writing
 *  of JavaScript programs which have Erlang/OTP semantics.
 *
 *  @description 
 *  'export class/function' chosen over an (export default) expression for explicitness:
 *
 *  @todo Make an Atom() class datatype?
 *
 *  @todo Check each METHOD... should it be .STATIC or #INSTANCE? 
 *
 *  @todo Proxy the 'console' object so that we can toggle debug levels
 *
 *  @todo serl.js should be serl.mjs - but the lousy dev server doesn't serve the right
 *  mime type 
 *
 *  @todo https://docsify.js.org/#/quickstart ?
 *
 *  @todo export class Reference ()
 */

'use strict'

import { Node } from    './classes/node.js'
import { Pid } from     './classes/pid.js'
import { Proc } from    './classes/proc.js'

export { Node, Pid, Proc }

/** 
 *  @typedef {integer} module:Serl.NodeIndex The primary location of values of
 *  his type is at [Node.nodeMap.counter]{@link
 *  module:Serl.'Node.nodeMap'.counter}. These are then used as keys of 
 *  [Node.nodeMap]{@link module:Serl.'Node.nodeMap'}. They are also used as the
 *  first integer value in the string representation of a [Pid]{@link
 *  module:Serl.Pid}.
 *
 *  This custom type exists only in documentation, and must be manually enforced
 *  in code, by developers.
 */

/** @typedef {integer} module:Serl.ProcIndex The primary location of values of
 *  this type is at [ProcMap.counter]{@link
 *  module:Serl.ProcMap.counter}. These are then used as the second
 *  integer value in the string representation of a [Pid]{@link
 *  module:Serl.Pid}. ** UNLIKE [NodeIndex]{@link module:Serl.NodeIndex}, these
 *  are NOT keys of [Node.procMap]{@link module:Serl.'Node.procMap'}. **
 *
 *  This custom type exists only in documentation, and must be manually enforced
 *  in code, by developers.
 */

/**
 *  @function module:Serl.recurse
 *  @description Utility function that helps reduce boilerplate in spawn/n for
 *  recursing functions. 
 *  @todo Make 'recurse' work with all arities of spawn/n
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

