import * as Serl from '../lib/serl.js'

console.log ( `[TEST # 1 : demonstration of JSON.stringify() failures` ); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

    let keyedSym    =    Symbol.for('symKey')
    let symVal      =    Symbol.for('val')

    let data    =   {
      string    : 'string',
      number    : 123,
      bool      : false,
      nul       : null,
      nan       : NaN,  
      array     : [4,5,6],
      object    : {
        a : 7,
        b : 8,
        c : 9,
      },  

      inf       : Infinity,  
                    // forced to 'null'
      re        : /.*/,  
                    // forced to {} 
      date      : new Date(),  
                    // stringified
      undef     : undefined,  
                    // lost
      longFunEx : function () { console.log ('serialise me') },
                    // lost
      shortFunEx: () => console.log ('serialise me'),
                    // lost
      sym       : symVal,
                    // lost
      circFun   : function () {
          this.description          =   'I am a circular function.'
          this.circularReference    = this
      },
                    // lost
    }

    data[keyedSym]      =   'value of keyed symbol'
                    // lost

    data.circArray     =   [11,22,33]
    //data.circArray[4]  =   data.circArray
                    // TypeError 

    data.circObject    =   { w: 44, x: 55, y: 66 }
    //data.circObject.z  =   data.circObject
                    // TypeError 

    let result = JSON.stringify ( data, null, '\t' )
    console.log(result) 

    return result 

})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}




/*
let n   =   new Serl.Node ('v0.0.2-dev-test1')

let mod1    =   { f1 : f1 }
let pid1    =   n.spawn ( mod1, 'f1', [] )
*/

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
