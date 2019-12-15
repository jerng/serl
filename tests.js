import * as Serl from './serl.js'

console.log ( `[TEST #1 : does the Node class / function / object exist?` )
try { console.log ( `OK: CODE [[new Serl.Node instanceof Serl.Node]] RETURNED
    [[${new Serl.Node instanceof Serl.Node}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #1.1 : do Node instances have names ?` )
try { console.log ( `OK: CODE [[(new Serl.Node('tom')).name]] RETURNED [[${(new
    Serl.Node('tom')).name}]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #1.2 : does static method Pid.nodeIndexFromNodeName()
    work?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test1.2')
        return Serl.Node.nodeIndexFromNodeName ( n, n.name )
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test1.2')
        return Serl.Node.nodeIndexFromNodeName ( n, n.name )
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #2 : does the Pid class / function / object exist?` )
try { console.log ( `OK: CODE [[
        new Serl.Pid (  'placeholderNodeIndex', 
                        'placeholderProcIndex' ) instanceof Serl.Pid
    ]] RETURNED [[${
        new Serl.Pid (  'placeholderNodeIndex', 
                        'placeholderProcIndex' ) instanceof Serl.Pid
    }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #2.1 : how readable is the Pid's .toString()?` ); try {
    console.log ( `OK: CODE [[ 
        new Serl.Pid ( 'placeholderNodeName', 'placeholderProcIndex' )
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test2.1')
        return new Serl.Pid ( 'placeholderNodeName', 'placeholderProcIndex' )
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.log ( `[TEST #3 : spawn(()=>{})?` )
try { console.log ( `OK: CODE [[
        (new Serl.Node).spawn(()=>{})
    ]] RETURNED [[
        ${(new Serl.Node).spawn(()=>{})}
    ]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #3.1 : spawn(1)?` )
try { console.error ( `NO ERROR THROWN: CODE [[ 
        (new Serl.Node).spawn(1)
    ]] RETURNED [[
        ${(new Serl.Node).spawn(1)}
    ]]` ) } 
catch (e) { console.log(`OK: CODE [[
        (new Serl.Node).spawn(1)
    ]] RETURNED [[
        ${( e instanceof Error) 
                ? e 
                : new Error('Expected an error, did not obtain one.')}
    ]]`) } 
finally {console.log('] - - ')}

console.log ( `[TEST #3.2 : do successive calls to spawn() increment the Proc
Pids in the Node's procMap?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node('test3.2')
        return [n.spawn(()=>{}), n.spawn(()=>{})]
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

console.error ( `[TEST #3.n : tests for arities != 1, unwritten at this time.]` )

console.log ( `[TEST #4 : Node's procMap is readable ?` )
try { console.log ( `OK: CODE [[ (new Serl.Node).procMap.counter ]] RETURNED
    [[${ (new Serl.Node).procMap.counter }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #4.1 : Node's procMap is writable ?` )
try { console.log ( `OK: CODE [[  
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    ]] RETURNED [[${(()=>{
        let n = (new Serl.Node)
        n.procMap.counter += 1
        return n.procMap.counter
    })() }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #5 : does the Proc class / function / object exist?` )
try { console.log ( `OK: CODE [[
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    ]] RETURNED [[${
        new Serl.Proc ( 'placeholderNodeName', 
                        'placeholderProcIndex', 
                        new Serl.Node ('test5') ) instanceof Serl.Proc
    }]]` ) } 
catch (e) { console.error(e) } 
finally {console.log('] - - ')}

console.log ( `[TEST #5.1 : how readable is the Proc's .toString()?` ); try { console.log ( `OK: CODE [[  
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
    ]] RETURNED [[${(()=>{
        let n = new Serl.Node ('test5')
        return new Serl.Proc ( n.name, 'placeholderProcIndex', n ) 
})() }]]` ) } catch (e) { console.error(e) } finally {console.log('] - - ')}

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
