/** 
 *  @class module:Serl.NodeMap
 *
 *  @description A map of a node's known (currently connected, and
 *  previously connected)) nodes, including itself. 
 *  
 *  Here we use a Map, because we anticipate frequent
 *  lookups based on given [NodeIndex]{@link module:Serl.NodeIndex}s. We
 *  also expect 'frequent additions and removals of key-value pairs'
 *  
 *  @property {module:Serl.NodeIndex} @keys Keys in the Map should be
 *  of this type.
 *
 *  @property { described } @values Values in the Map should be
 *   of the form <code>{ name: [NodeName]{@link module:Serl.Node#name}
 *  }</code>. 
 *
 *  @property { integer } counter {@link
 *  module:Serl.NodeMap.counter}
 *
 *  @todo Add nodeMap.counter to make this consistent with
 *  procMap.counter; update docs to remind developers to enforce
 *  nodeIndex = parseInt(nodeIndex).
 *
 *  @todo Values should have their own class.
 *
 *  @todo Should NodeMap have its own class? 
 */

export { NodeMap }

class NodeMap extends Map {

    constructor ( ...args ) {

        super ( ...args )

        /**
        *   @name module:Serl.NodeMap.counter
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
        this.counter = 0

    }

}
