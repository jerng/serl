/**
 *  @class module:Serl.ProcMap
 *
 *  @description Intended primarily for use at [Node.procMap]{@link
 *  module:Serl.Node#procMap}.
 *
 *  A map of a node's local processes (any instances of
 *  [Proc]{@link module:Serl.Node.Proc} which were created by calling
 *  [spawn/n]{@link module:Serl.Node.spawn} on that node.
 *   
 *  Here we use a Map, because we anticipate frequent
 *  lookups based on given [Pid]{@link module:Serl.Pid}s. We also expect
 *  'frequent additions and removals of key-value pairs'
 *
 *  Each node must track all its previously spawned processes, and so we
 *  want an incrementing [ProcMap.counter]{@link
 *  module:Serl.ProcMap.counter}, to ensure that for the lifetime
 *  of a node, N, all of N's local processes have a unique ProcIndex. 
 * 
 *  @property {module:Serl.Pid} @keys Keys in the Map should be
 *  {@link module:Serl.ProcMap} 
 *
 *  @property {module:Serl.Proc} @values Values in the Map should be
 *  instances of this class.
 *
 *  @property {module:Serl.ProcIndex} counter {@link
 *  module:Serl.ProcMap.counter}
 *
 *  @todo update docs to remind developers to enforce
 *  nodeIndex = parseInt(nodeIndex).
 *
 *  @todo Should ProcMap have its own class? 
 */

export { ProcMap }

class ProcMap extends Map {

    constructor ( ...args ) {

        super ( ...args )

        /**
        *   @name module:Serl.ProcMap.counter
        *
        *   @description This helps us avoid duplicate process-indices on the
        *   local node, when generating a Pid object. 
        * 
        *   In the current implementation, the upper limit seems to simply be
        *   the size of Node.procMap.counter. (In Erlang, the equivalent number
        *   is stored in 18 to 28 bits, after which numbers are reused...
        *   however in JavaScript, it seems we have almost 53 bits...)
        * 
        */
        this.counter = 0

    }

    set ( pid, value ) {
        return super.set ( pid.nodeIndex + '.' + pid.procIndex, value )
    }
    
    get ( pid ) {
        return super.get ( pid.nodeIndex + '.' + pid.procIndex )
    }

}
