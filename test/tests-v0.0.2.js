import * as Serl from '../lib/serl.js'

let n   =   new Serl.Node ('v0.0.2-dev-test1')

let mod1    =   { f1 : f1 }
let pid1    =   n.spawn ( mod1, 'f1', [] )


//let pid2    =   n.spawn ( f2 )


/* template test (NO-expected-error):

console.log ( `[TEST # : ?` ); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

        return x
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

*/
/* template test (expected-error):

console.log ( `[TEST # : ?` ) try { console.error ( `NO ERROR THROWN: CODE [[ 

    ]] RETURNED [[

    ]]` ) } catch (e) { console.log(`OK: CODE [[

    ]] RETURNED [[ ${( e instanceof Error) ? e : new Error ('Expected an error,
did not obtain one.')} ]]`) } finally {console.log('] - - ')}

*/
/* templace test (simply undone feature):

console.error ( `[TEST # : .]` )

*/
