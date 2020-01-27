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
      zerouns   : 0,    // Object.is( 0, +0 ) returns true
      zeropos   : +0,
      zeroneg   : -0,
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
      infpos    : Infinity,  
                    // forced to 'null' - fixed
      infneg    : -Infinity,  
                    // forced to 'null' - fixed
      re        : /.*/,  
                    // forced to {} - fixed
      date      : new Date(),  
                    // stringified - fixed
      undef     : undefined,  
                    // lost
      longFunEx : function (arg1, arg2) {     
        console.log ('longFunEx seems to be running')
        console.log ('    this: '       + this)
        console.log ('    globalThis: ' + globalThis)
        console.log ('    window: '     + window)
        console.log ('    args1,2: '       + arg1 + arg2)
      },
                    // lost
      shortFunEx: (arg1, arg2) => {
        console.log ('shortFunEx seems to be running')
        console.log ('    this: '       + this)
        console.log ('    globalThis: ' + globalThis)
        console.log ('    window: '     + window)
        console.log ('    args1,2: '       + arg1 + arg2)
      },
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
            switch ( valueType ) {
                // TODO:    test if performance improves by testing valuetype[0]
                //          instead

                case 'object':
                    if ( value instanceof Date )  { return { _serlType: 4,
                                                             v: value.toISOString() }
                    }
                    if ( value instanceof RegExp )  return { _serlType: 3,
                                                             v: value.toString().slice( 1, -1 ) }
                    /* otherwise literally */       return value 

                case 'function':
                    let stringifiedFunction = value.toString()
                        //  TODO: it is possible here to test for fat arrow, or
                        //      long function expressions.
                        //  - fat arrows without braces need to be braced
                        //  - fat arrows with braces need to be untouched
                        //  - 'use strict;' must be added before any function
                        //  expression
                                                    return { _serlType: 5,
                                                             v: stringifiedFunction }

                /* default: do nothing */
            }

            if ( Object.is (value, NaN) )       return { _serlType: 0 }  
            switch ( value ) {
                case Infinity :                 return { _serlType: 1 } 
                case -Infinity :                return { _serlType: 2 } 
                /* default: do nothing */
            }
            return value
    }
    // TODO: Instead of `{ _serlType : x }` consider `[ value? ].type = x` (test performance)

    let reviver =   (key, value) => {

            let valueType = typeof value

            switch ( valueType ) {

                case 'object' :

                    if ( value === null ) { return value }
                    
                    switch ( value._serlType) {
                        case 0 :            return NaN 
                        case 1 :            return Infinity
                        case 2 :            return -Infinity
                        case 3 :            return RegExp( value.v )
                        case 4 :            return new Date( value.v )
                                                // Excluding `new` does not work

                        case 5 :            return Function ( `"use strict"; 

                            //console.log ('arguments: ' + JSON.stringify(arguments) )

                            return (${value.v}).apply ( null, arguments) ` )
                                                //
                                                // Declares function expressions
                                                // in the global scope.
                                                //
                                                // Here, `this` is null, but
                                                // spawn/n might make it the
                                                // calling Proc.
                                                

                        /* default:         do nothing */
                    } 
                    return value 

                    break

                /* default: do nothing */
            }

            return value
    }

    let stringified
    { 
        // Disables the default toJSON() from stringifying
        let defaultDateToJSON   = Date.prototype.toJSON
        delete Date.prototype.toJSON
        stringified = JSON.stringify ( data, replacer, '\t' )
        Date.prototype.toJSON   = defaultDateToJSON
    }
    console.log ( stringified )
    
    let parsed = JSON.parse (stringified, reviver)
    console.log ( parsed )
    console.log ( parsed.longFunEx  ( 'iAmArg1', 'iAmArg2' ) )
    console.log ( parsed.shortFunEx ( 'iAmArg1', 'iAmArg2' ) )

    return 'see console.log ( parsed ) above' 

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
