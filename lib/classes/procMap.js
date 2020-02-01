/**
 *  @class module:Serl.ProcMap
 *  @todo **DOCUMENTATION**
 */

export { ProcMap }

class ProcMap extends Map {

    set ( pid, value ) {
        return super.set ( pid.nodeIndex + '.' + pid.procIndex, value )
    }
    
    get ( pid ) {
        return super.get ( pid.nodeIndex + '.' + pid.procIndex )
    }

}
