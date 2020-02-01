import * as Serl from   '../lib/serl.js'
import * as SSON from   '../lib/sson/sson.js'

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
                      // lost - ok
        longFunEx : function (arg1, arg2) {     
          console.log ('longFunEx seems to be running')
          console.log ('    this: '       + this)
          console.log ('    globalThis: ' + globalThis)
          console.log ('    window: '     + window)
          console.log ('    args1,2: '       + arg1 + arg2)
          return 'longFunEx returned value'
        },
                      // lost - fixed
        shortFunEx: (arg1, arg2) => {
          console.log ('shortFunEx seems to be running')
          console.log ('    this: '       + this)
          console.log ('    globalThis: ' + globalThis)
          console.log ('    window: '     + window)
          console.log ('    args1,2: '       + arg1 + arg2)
          return 'shortFunEx returned value'
        },
                      // lost - fixed
        sym       : symVal,
                      // lost - ok

        //  Serl will not explicitly support circular references.
        //
        //  longCircFunEx   : function () {
        //    this.circularReference    = this
        //    console.log ('longCircFunEx seems to be running')
        //    console.log ('    this: '       + this)
        //    //console.log ('    this: '       + this.circularReference)
        //  },
                      // lost
    }

    data[keyedSym]      =   'value of keyed symbol'
                    // lost - ok 

    //  Serl will not explicitly support circular references.
    //
    //  data.circArray     =   [11,22,33]
    //  //data.circArray[4]  =   data.circArray
    //                  // TypeError 

    //  data.circObject    =   { w: 44, x: 55, y: 66 }
    //  //data.circObject.z  =   data.circObject
                        // TypeError 

    let bigIntString    =   '244684765745644357464554765466456476556467565'
    data.bigInt         =   BigInt ( bigIntString )
                    // TypeError - fixed

    // TODO: replacer and reviver below: are written here to demonstrate
    // hierarchy of types, but may be refactored for performance.


    


    let stringified
    { 
        // Disables the default toJSON() from stringifying
        let defaultDateToJSON   = Date.prototype.toJSON
        delete Date.prototype.toJSON
        stringified = JSON.stringify ( data, SSON.replacer, '\t' )
        Date.prototype.toJSON   = defaultDateToJSON
    }
    console.log ( stringified )
    
    let parsed = JSON.parse (stringified, SSON.reviver)
    console.log ( parsed )
    console.log ( parsed.longFunEx  ( 'iAmArg1', 'iAmArg2' ) )
    console.log ( parsed.shortFunEx ( 'iAmArg1', 'iAmArg2' ) )

    return 'see console.log ( parsed ) above' 

})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST (above): note that parsed function expressions have their
\`this\` value assigned to \`null\`.]` )
console.error ( `[TEST (above): support for more types, such as \`TypedArray\` to
be added in the future.`)


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
