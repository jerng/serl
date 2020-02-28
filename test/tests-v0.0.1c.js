import * as Serl from '../lib/serl.js'
import * as SSON from '../lib/sson/sson.js'
import * as Exam from '../lib/classes/exam.js'

new Exam.Exam ( {
    concerns : [

{   test : `3.5 : how do processes send messages? (includes 15k message test
site) (f1a,b,c,d,e, are mutually exclusive options for testing; you want to read
the code... f1e is the most sophisticated option`,
    code : function () {

        let n       =   new Serl.Node ('test3.5')

        // f1a is a non-recursing listener that will end after being matched to its
        // first message.
        let f1a      =   async function (){
            let awaited1a    = await this.receive([
                [   ()=>true, 
                        // simplest blind guard, until we improve Proc.receive
                        // TODO
                    m => m
                        // identity function
                ]               
            ])
            console.log ( `NEWS-3.5, f1a body, (awaited1a) value: [[${awaited1a}]],
                type: [[${typeof awaited1a}]]` ) 
        }

        // f1b is a recursing variation of f1a - which will match a message and
        // then reset itself to match another message.
        let f1b      =   async function (){

            let f1bNamed   =   async function (){ 
                //  'async'     required for 'await'
                //  'function'  required for 'this'

                this_block_can_be_lifted_1: {
                let awaited1b    = await this.receive([
                    [   ()=>true, 
                            // simplest blind guard, until we improve Proc.receive
                            // TODO
                        m => m
                            // identity function
                    ]               
                ])
                console.log ( `NEWS-3.5, f1bNamed body, (awaited1b) value:
                    [[${awaited1b}]], type: [[${typeof awaited1b}]]` ) 
                }
       
                f1bNamed.call (this) // recursion
                    // Tests indicate this does not blow the stack.

            } // f1bNamed

            f1bNamed.call ( this ) // Initiating call to recursive function.
        } // f1b

        // f1d is a minimally modified version of f1b
        let f1d      =   async function (){
            let f1dNamed   =   async ( proc ) => { 
                let awaited1d    = await proc.receive([
                    [ ()=>true, m => m ]               
                ])
                console.log ( `NEWS-3.5, f1dNamed body, (awaited1d) value:
                    [[${awaited1d}]], type: [[${typeof awaited1d}]]` ) 
                f1dNamed ( proc ) 
            } 
            f1dNamed ( this ) 
        } // f1d

        //  f1c is a structurally modified version of f1d
        //  

        let f1c = async function ( ) {
            // 'function'   in expression needed, for 'this' in body
            // 'async'      in expression needed, for 'await' in body
            let awaited1c    = await this.receive([
                [ ()=>true, m => m ]               
            ])
            console.log ( `NEWS-3.5, f1e body, (awaited1c) value:
                [[${awaited1c}]], type: [[${typeof awaited1c}]]` ) 
        }

        // f1e uses the same technique as f1c, demonstrated the abiliy to pass
        // arguments to the recursed proc-fun.
        globalThis.f1e_concluded = false 
        globalThis.f1e_result = []
        if ( navigator && navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
            globalThis.f1e_totalJSHeapSize = globalThis.performance.memory.totalJSHeapSize
            globalThis.f1e_usedJSHeapSize  = globalThis.performance.memory.usedJSHeapSize
        }


        let f1e = async function ( ) {
            // 'function'   in expression needed, for 'this', 'arguments'
            // 'async'      in expression needed, for 'await' in body
            let awaited1e    = await this.receive([
                [ ()=>true, m => m ]               
            ])
            globalThis.f1e_result.push ( `NEWS-3.5, f1e body, (awaited1e) value:
                [[${awaited1e}]], type: [[${typeof awaited1e}]]; arguments
                passed to f1e are: [[${arguments[0]}]], [[${arguments[1]}]]` ) 
        }

        let f2      =   async function ( recipientPid ){

            console.time('test 3.5')

            console.log ( `NEWS-3.5, f2 body, row before this.send()`)
            this.send ( recipientPid, 'ohai' )
            this.send ( recipientPid, 'ohai again' )

            let counter     = 0
            //let countToSend = 1     // shim
            let countToSend = 15000 // do your 15k test here
            while ( counter < countToSend ) 
            {
                counter ++
                this.send ( recipientPid, 'counted messages:' + counter )
            }

            let id = setInterval ( () => { 

                        console.log ( [ id, countToSend, globalThis.f1e_result.length ] )
                        
                        if ( ( globalThis.f1e_result.length - 2 ) == countToSend ) {
                            clearInterval ( id )
                            console.log ( globalThis.f1e_result )
                            console.log ( globalThis.f1e_result.length + ' messages received' )
                            console.timeEnd('test 3.5')

                            if ( navigator && navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
                                console.log (
`Total JS Heap Size delta   : ${(globalThis.performance.memory.totalJSHeapSize - globalThis.f1e_totalJSHeapSize)/1000000} MB
Used JS Heap Size delta    : ${(globalThis.performance.memory.usedJSHeapSize - globalThis.f1e_usedJSHeapSize)/1000000} MB` 
                                ) 
                            }

                            globalThis.f1e_concluded = true
                        } 
                        
                        }, 
                        200 
                    )

        }


// f1a, f1b, f1c, f1d, f1e, are mutually exclusive options for testing

        //let mod1    =   { recurse: recurse }
        
        //let pid1    =   n.spawn ( f1b )
        //let pid1    =   n.spawn ( f1d )
        //let pid1    =   n.spawn ( mod1, 'recurse', [f1c] )
        //let pid1    =   n.spawn ( mod1, 'recurse', [f1e, ['bill','bob']] )
        
        let pid1    =   n.spawn ( Serl, 'recurse', [f1e, ['bill','bob']] )

        let mod2    =   { f2: f2 }
        let pid2    =   n.spawn ( mod2, 'f2', [pid1] )

        //let proc1   =   n.procMap.get(pid1) 
        //let proc2   =   n.procMap.get(pid2) 
       
        //proc1.mailHandler ( 'ohai' )
            // User should never send messages like this.




                        // THIS IS A HACK to get the test report to print nicely. See warning
        return  new Promise ( fulfill => {
                    let id = setInterval ( () => { globalThis.f1e_concluded ? fulfill() : null }, 200 )
                } )

    },
    want : 'vfun',      // THIS IS A HACK to get the test report to print nicely. See warning
    vfun : () => true   // THIS IS A HACK to get the test report to print nicely. See warning
},
{   warning : `3.5. Do your 15k test by uncommenting the relevant shim.`,
},
{   warning : `3.5, here f1bNamed makes a tail-call to itself, but it
is not clear that this will not blow the call-stack; see note at f1bNamed;
check`,
},


/* Templates: 

{   test : ``,
    code : function () {
    }
},

{   test : ``,
    expectError : true,
    code : function () {
    }
},

{   warning : ``,
},
*/
    ]
} )
