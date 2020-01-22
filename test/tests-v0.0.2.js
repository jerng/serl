import * as Serl from '../lib/serl.js'

console.log ( `[TEST # 1 : demonstration of JSON.stringify() failures; check
against
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify` ); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

        


})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST # 1: Reconstruct this after TEST #2 rectifications are complete..]` )
console.error ( `[TEST # 1b: Other instances of Object: Map, Set, WeakMap, and WeakSet).]` )

console.log ( `[TEST # 2 : rectification of JSON.stringify() failures` ); try { console.log ( `OK: CODE [[  

    ]] RETURNED [[${(()=>{

    let keyedSym    =    Symbol.for('symKey')
    let symVal      =    Symbol.for('val')

    let data    =   {
      string    : 'string',
      number    : 123,
      bool      : false,
      nul       : null,
      array     : [4,5,6],
      object    : {
        a : 7,
        b : 8,
        c : 9,
      },  

      nan       : NaN,  
                    // forced to 'null' - fixed
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

    let bigIntString    =   '244684765745644357464554765466456476556467565'
    //data.bigInt         =   BigInt ( bigIntString )
                    // TypeError 

    // TODO: replacer and reviver below: are written here to demonstrate
    // hierarchy of types, but may be refactored for performance.


    let replacer = (key, value) => {
            let valueType = typeof value
            if ( valueType == 'object' )    { return value }
            if ( Object.is (value, NaN) )   { return { _serlType: 'NaN' } } 
            return value
    }
    // TODO: _serlType values could be optimised to be something other than strings

    let reviver =   (key, value) => {
            let valueType = typeof value
            if ( valueType == 'object')    { 

                if ( value === null ) { return value }
                
                switch ( value._serlType) {
                    case 'NaN':
                        return NaN
                        break
                    default:
                } 
                return value 
            }
            return value
    }

    let result = JSON.stringify ( data, replacer, '\t' )

    console.log( JSON.parse (result, reviver) ) 

    return 'see console.log() above' 

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
