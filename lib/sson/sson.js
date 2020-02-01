/** @module SSON
 *  
 *
 */

import { Pid } from     '../classes/pid.js'

export { replacer, reviver } 

/**
 *  @property module:SSON.serialReplacer
 *  
 *  @description Serl uses this interface to ensure that functions passed to
 *  [spawn/n]{@link module:Serl.Node#spawn} (which spawn/n assigns to new procs) are truly portable lambdas,
 *  where the function body has no variables in scope which were defined outside
 *  the function body. Architects deploying Serl may choose to overwrite the
 *  default implementation of the interface, with their own custom code, or a
 *  third-party library.
 *
 *  @see [WARNING]{@link module:Serl.Node#spawn} under spawn/n
 *
 *  @see Related: on [stackoverflow]{@link
 *  https://stackoverflow.com/questions/1833588/javascript-clone-a-function}
 *
 *  @see The table below is from MDN, [Enumerability and ownership of properties]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties}:
 *
 *  | |in|for..in|obj.hasOwnProperty|obj.propertyIsEnumerable|Object.keys|Object.getOwnPropertyNames|Object.getOwnPropertyDescriptors|Reflect.ownKeys()|
 *  |-|--|-------|------------------|------------------------|-----------|--------------------------|--------------------------------|-----------------|
 *  | Enumerable |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>
 *  | Nonenumerable  |<span style="background-color:#cfc;">true</span>    |false   |<span style="background-color:#cfc;">true</span>    |false   |false   |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>
 *  | Symbols keys   |<span style="background-color:#cfc;">true</span>    |false   |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |false   |false   |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>
 *  | Inherited Enumerable   |<span style="background-color:#cfc;">true</span>    |<span style="background-color:#cfc;">true</span>    |false   |false   |false   |false   |false | false
 *  | Inherited Nonenumerable    |<span style="background-color:#cfc;">true</span>    |false   |false   |false   |false   |false | false  |false
 *  | Inherited Symbols keys |<span style="background-color:#cfc;">true</span>    |false   |false   |false   |false   |false   |false | false
 *
 *  ... therefore, as `in` is not an iterating tool, there is no single
 *  Sufficient tool for iterating through properties to perform deep cloning.
 *
 *  The MDN link above cites the following stackoverflow answer on,
 *  '[getting non-enumerable, ineherited, properties of an object]{@link
 *  https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object/8024294#8024294}'
 *  in deploying this pattern to walk up the prototype chain:
 *   ```
 *   var accumulator
 *   do  { // THINGS TO accumulator USING object
 *       } while ( object = Object.getPrototypeOf ( object ) )
 *   return accumulator
 *   ```
 *  @see Symbols on MDN 
 *  - Perspective A: MDN, [Symbol]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol},
 *  indicates that symbols add no outstanding benefit to performance or privacy,
 *  and should be regarded as useful only for guaranteeing uniqueness of keys on
 *  a per-runtime basis. Some OTP code has per-runtime variables, so we should
 *  implement those using JavaScript symbols. But with regards to inter-runtime
 *  communications, we don't want to try to send symbols over the wire. Also
 *  there is probably no benefit to using Symbol to model Erlang's Atom.
 *      - Moreover, should we seek to use JSON.stringify() and JSON.parse() with
 *  their 'replacer/replacer function' parameters, the [MDN docs]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
 *  indicate that *All Symbol-keyed properties will be completely ignored,
 *  even when using the replacer/reviver function.*
 *  - Perspective B: Atoms should be modelled as [Symbol.for()]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for}
 *  because these are respectively implemented in a very similar way, using a
 *  look-up table under the hood. Note that Erlang's atom table is never garbage
 *  collected; check on how JavaScript handles Symbol tables. Finally, before
 *  deciding to use this, run performance tests on arbitrary-length string
 *  comparisons, and Symbol comparisons where Symbol.for(keys), where keys are
 *  arbitrary-length strings.
 *
 *  @see MDN, on JSON.parse() and JSON.stringify() using the `replacer/reviver function`
 *  argument. 
 *
 *  Specifically... note that [.toJSON() behaviour]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior}
 *  does NOT allow REFLECTION, and thus appears rather useless for our attempt
 *  to serialise function objects. For example:
 *  ```
    var obj = {
        data: 'data',
        
        toJSON (key) {
            if (key)
                return `Now I am a nested object under key '${key}'`;
            else
                return this;
        }
    };

    JSON.stringify(obj);
    // '{"data":"data"}'

    JSON.stringify({ obj })
    // '{"obj":"Now I am a nested object under key 'obj'"}'

    JSON.stringify([ obj ])
    // '["Now I am a nested object under key '0'"]'
 *  ```
 *  
 *  ... since `toJSON()` is a dead-end, we should return to the `replacer
 *  function` approach. Note however that the [ECMA specification]{@link
 *  https://tc39.es/ecma262/#sec-serializejsonproperty} requires toJSON() to parse a
 *  `value` before that value is passed to any `replacer` function, so for
 *  example: you can't detect Date object values in the replacer function using
 *  `instance of Date` because they have already been converted to a string.
 *  Therefore in order to work with this, we have to side-step the toJSON()
 *  function before calling `JSON.stringify()`... D:
 *
 *  @see Benchmark indicates that `String.slice()` is fastest: [Remove First and Last Characters in String]{@link
 *  https://www.measurethat.net/Benchmarks/Show/6951/0/remove-first-and-last-characters-in-string}.
 *
 *  @see Measurethat.net benchmark indicates that for comparison of null vs.
 *  null, `===` is fastest, followed by `==`, and `Object.is()` is significantly
 *  slower.
 *
 *  `switch-case` uses `===`
 *
 *  `switch x - case y` with no `default`, and `if ( x === y)` with no `else` are the same. 
 *
 *  Additional `-case`s are faster than additional `else`s. 
 *
 *  @see MDN on [strict mode]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode}.
 *
 *  **Normal (long) function expressions:** the `this` keyword in the function
 *  body, will default to `undefined` instead of `globalThis`; yet `this` can be
 *  assigned by `call() / bind() / apply()` to some other value, perhaps the
 *  function object itself.
 *
 *  **Arrow function expressions:** the `this` keyword in the function body,
 *  will follow the enclosing scope's `this` as usual for arrow function
 *  expressions.
 *
 *  Of note, MDN notes that [arrow function expressions]{@link
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions}
 *  with function bodies invoking `use strict` WILL (abnormally) assign a value to
 *  `this` INSIDE the function body, where the value is the value of `this` from
 *  the surrounding lexical context. In other words, the strictness of an arrow
 *  function body WILL NOT AFFECT ITS `this` value. *All other strict mode rules
 *  apply normally.*
 *
 *  @see Serl will not explicitly support circular variable references, as these are not
 *  featured in Erlang.
 *
 */

let replacer = (key, value) => {

    let valueType = typeof value
    switch ( valueType ) {
        // TODO:    test if performance improves by testing valuetype[0]
        //          instead

        case 'object' :
            if ( value instanceof Pid ) {   return { _serlType: 7,
                                                     v: { nodeIndex: value.nodeIndex,
                                                          procIndex: value.procIndex } } }
            if ( value instanceof Date ) {  return { _serlType: 4,
                                                     v: value.toISOString() } }
            if ( value instanceof RegExp )  return { _serlType: 3,
                                                     v: value.toString().slice( 1, -1 ) }
            /* otherwise literally */       return value 

        case 'function' :
            let stringifiedFunction = value.toString()
                                            return { _serlType: 5,
                                                     v: stringifiedFunction }
            //  TODO: it is possible here to test for fat arrow, or
            //      long function expressions.
            //  - fat arrows without braces need to be braced
            //  - fat arrows with braces need to be untouched
            //  - 'use strict;' must be added before any function
            //  expression

        case 'bigint' :
                                            return { _serlType: 6,
                                                     v: value.toString() }
            
        /* default: do nothing */
    }

    if ( Object.is (value, NaN) )           return { _serlType: 0 }  
    switch ( value ) {
        case Infinity :                     return { _serlType: 1 } 
        case -Infinity :                    return { _serlType: 2 } 
        /* default: do nothing */
    }
    return value

}
// TODO: Instead of `{ _serlType : x }` consider `[ value? ].type = x` (test performance)

/**
 *  @property module:Serl.serialReviver
 *  
 */

let reviver = (key, value) => {

    let valueType = typeof value

    switch ( valueType ) {
//
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
                    return (${value.v}).apply ( this, arguments ) ` )
                                        //
                                        //  Declares function expressions
                                        //  in the global scope.
                                        //
                                        //  Here, `this` is the 
                                        //  calling Proc. 
                                        // 
                                        //  Other options:
                                        //
                                        //  spawn/n might make `this` the function
                                        //  object itself. 
                                        //
                                        //  Generally, letting `this` be `null` is
                                        //  safest, to prevent access to
                                        //  parent or global objects.
                case 6 :            return BigInt ( value.v )
                case 7 :            return new Pid (    value.v.nodeIndex,
                                                        value.v.procIndex )

                /* default:         do nothing */
            } 
            return value 

            break

        /* default: do nothing */
    }

    return value
}

