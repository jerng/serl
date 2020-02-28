import * as Serl from '../lib/serl.js'
import * as SSON from '../lib/sson/sson.js'
import * as Exam from '../lib/classes/exam.js'

new Exam.Exam ( {
    concerns : [

{   test : `3.4 : how do processes receive messages?`,
    code : function () {

        let returnedPromise = new Promise ( ( fulfill, reject ) => {

            //  INIIALISATION of F1

            let n   =   new Serl.Node ('test3.4')
            let F1  =   async function(){

                let view_all_3_4 = true // comment toggler
                let branches

                console.groupCollapsed ('3.4.2. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this} is spawning; logging the function body
                        line BEFORE this.receive()'s 1st call`) 

                    branches = [
                        [   message => message == 1 ,                               // guard
                            message => `guard passed, message == 1`                    // path
                        ],
                        [   message => typeof message == 'number',                  // guard
                            message => `guard passed, message not 1, but a number`     // path
                        ],
                        [   message => typeof message == 'string',                  // guard
                            message => `guard passed, not a number, but a string`      // path
                        ],
                        [   message => typeof message == 'function',                // guard
                            message => () => { return `guard passed, a function` }     // path
                        ],
                    ]

                    // TODO: nomenclature... awaited? received? = this.receive?  this.waiter?
                }
                console.groupEnd ('3.4.2. F1() body')

                let awaited1     = await this.receive( branches )
                // F1 PAUSES HERE

                console.groupCollapsed ('3.4.3. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the
                        function body line AFTER this.receive()'s 1st call`) 
                    view_all_3_4 && console.log (`NEWS-3.4, F1: awaited1 is [[${awaited1}]] type: ${typeof
                        awaited1}`)
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body
                        line BEFORE this.receive()'s 2nd call`) 
                }
                console.groupEnd ('3.4.3. F1() body')

                let awaited2    = await this.receive( branches )
                // F1 PAUSES HERE

                console.group ('3.4.4. F1() body')
                {
                    view_all_3_4 && console.log (`NEWS-3.4, F1: ${this}; logging the function body line
                        AFTER this.receive()'s 2nd call`) 
                    view_all_3_4 && console.log (`NEWS-3.4, F1: awaited2 is [[${awaited2}]] type: ${typeof
                        awaited2}`)
                }
                console.groupEnd  ('3.4.4. F1() body')

                // store test results
                globalThis.TEST_3_4     = [ this.mailbox, awaited1, awaited2 ]

            } 
            // F1's definition ends

            console.groupCollapsed ('3.4.1. spawn(F1) :')
            {
            //  EXECUTION of F1 in a process

                let pid     = n.spawn(F1)
                
                // at this point, 
                //  'let awaited1 = await this.receive(branches)
                //  proc.mailHandler has been customised by proc.receive; end 3.4.2.
                //  F1's execution context is pushed onto the stack, with control returning to
                //  this line ->>

                console.log (`NEWS-3.4: AFTER F1`) 

            //  TEST: how does the process react?

                let proc    = n.procMap.get(pid) 
                let m1      = {1:"should not match"}
                let m2      = {2:"should not match"}
                
                proc.mailHandler ( m1 ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '${m1}'...`) 

                proc.mailHandler ( m2 ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '${m2}'...`) 

                proc.mailHandler ( 'ohai' ) // User should never send messages like this.

                //  The customised mailHandler lets 'ohai' pass,
                //  proc.mailHandler is reset to defaultMailHandler;
                //  and proc.(default)mailHandler stores the message ()=>{}
                //
                //  then, F1's execution is paused, with control passed to : 
                //  'let awaited2 = await this.receive(branches)
                //
                //  proc.mailHandler SHOULD HAVE been customised by proc.receive
                // 

                    console.log (`NEWS-3.4: AFTER F1, sending the message 'ohai'...`) 

                proc.mailHandler ( ()=>{} ) // User should never send messages like this.
                    console.log (`NEWS-3.4: AFTER F1, sending the message '()=>{}'...`) 

                // Initial synchronous run through concerns, ended here.
                //  then F1's execution context is popped,  and control is returned to it; 
                // -->> start 3.4.3. 

            }
            console.groupEnd ('3.4.1. spawn(F1) :')
            
            // In the future, get the test results and fulfill the promise
            setTimeout ( ()=>{ 
                    fulfill ( JSON.stringify ( globalThis.TEST_3_4 , SSON.replacer, 2) ) 
                }, 
                1000 
            )

        } ) // new Promise
        return returnedPromise
    },
    want : JSON.stringify ( 
        [   [   {1:"should not match"},
                {2:"should not match"}
            ],
            `guard passed, not a number, but a string`,
            () => { return `guard passed, a function` }
        ],
        SSON.replacer, 2 )
},
{   warning : `
3.4: break this up into a series of small tests
    //  Code it here, then move it to serl.js
    //
    //  If fun doesn't call Serl.Proc.receive(), then fun doesn't wait, and runs till
    //  completion.
    //  If fun DOES call Serl.Proc.receive(), then fun has to AWAIT its result,
    //  which must be a Promise
`,
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
