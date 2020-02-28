# Project: Serl

Javascript/OTP, anyone? Here's an attempt to port
[Erlang](https://erlang.org/doc/getting_started/intro.html)/[OTP](https://erlang.org/doc/design_principles/des_princ.html)
(Open Telecom Protocol) semantics to browser-based ECMAScript.

## Project: Demo

To eyeball a very rough demo, serve the [repository
directory](https://github.com/jerng/serl), then click on the link to tests. Open
the console to see test output. Tweak the code in `tests.js` and see how it
reacts.

## Project: Versions 

[v0.0.1](https://github.com/jerng/serl/tree/v0.0.1)
([master](https://github.com/jerng/serl/tree/master)) - A documented
proof-of-concept, where a single node can spawn multiple procs, and where a proc
can recursively send >25,000 messages to another without blowing the stack. An
implementation of Erlang-style pattern matching is also demonstrated.

v0.0.2 ([develop](https://github.com/jerng/serl/tree/develop)) - Aiming to
simply to go through all the @todos and update the ones which improve DX, such
as turning weirdly shaped objects into classes, validating arguments, and
renaming things.

# Documentation

- Framework documentation is [hosted here](https://jerng.github.io/serl/).

## Documentation: Generation

Currently using [JSDoc](https://www.npmjs.com/package/jsdoc). 
* [JSDoc Documentation](https://jsdoc.app)
* JSDoc can suck in this Markdown file.
  * a [Markdown reference](https://en.support.wordpress.com/markdown-quick-reference/)

Quick start to generating documentation from JSDoc-formatted comments in source files:

```
$ cd path/to/serl-git-repository
$ npm install --save-dev jsdoc
$ node node_modules/jsdoc/jsdoc.js lib/serl.js -d docs -c node_modules/jsdoc/conf.json -R ./README.md
```
Current configuration of `conf.json`:
```
{
    "plugins": ["plugins/markdown"],
    "markdown": {
        "tags": [
            "description"
        ]
    },
    "allowUnknownTags": true
}
```
`.vimrc` line to auto-regenerate documentation on-save (example):
```

autocmd BufWritePost ~/exercises/serl/* !node 
    \ ~/exercises/serl/node_modules/jsdoc/jsdoc.js
    \ ~/exercises/serl/lib/ -r
    \ -d ~/exercises/serl/docs
    \ -c ~/exercises/serl/node_modules/jsdoc/conf.json
    \ -R ~/exercises/serl/README.md
```
## Documentation: TODO

Get on [JSDoc Slack](https://jsdoc-slack.appspot.com/).

# Architecture

## Architecture: Priorities

- Leverage on the maturity of OTP design patterns.

    - If `#itjustworks` in the browser, then we're on our way to using the same
      framework on the server and client.

    - Future possibilities: inter-op with OTP compliant code written in any
      language and working on any runtime. 

- General Erlang/OTP priorities.

    - No shared memory between procs.

    - Let it crash.

    - Asynchronous coding style should allow non/minimally-blocking programs.

        - Testing protocol to ensure this for all user code should be
          established.

    - Users must be reminded to write JavaScript like this.

    - Recursion should not block the stack. `#tailcalls`

        - Utilities need to be provided to ease writing this sort of code. (See
          `Serl.recurse/2` for example.)

- Otherwise minimally opinionated.

- Back to basics. The framework should encourage weak users,and also as well as
  to allow quick-starts on tiny projects.

    - The library should run out of the box. Building should optional.

    - The library should not require DSLs. Transpilation should be
      optional. Everything should work in `use strict`.

    - Server-side rendering should be optional. When SSR is enabled, de/hydration
      should be optional.

    - Performance optimisations should generally be optional.

    - Computed properties should be optional.

# Motivations?

I didn't want to do this. I wanted something like
[this](https://github.com/jerng/justjsf#versions-current-branch), but hit a
dead-end, and fell back to the approach on this repository. The current approach
is arguable more conservative, as we simply adopt Erlang/OTP architecture, and
don't dwell too much on deviating from it - thus we aim to obtain all the
pertinent benefits and opportunity costs (if you are not sure what these are,
you may want to read about how Erlang/OTP is designed, and what it is designed
to do.

Having set ourselves in that direction, here are some opportunities to look
forward to:

- JavaScript applications can be written, which run agnostic to whether their
  environment is 
  
  - 'on 'a server', 
  
  - 'in the browser',
  
  - 'by a function-as-a-service' such as AWS Lambda.

- Such applications may be cross-environment, being composed of various nodes
  on different environments, and these nodes would communicate with each other
  using the same protocol.

- Beyond JavaScript, if we manage through time to stick very closely to
  Erlang/OTP semantics, we may even look forward to interfacing with Erlang/OTP
  nodes directly from JavaScript/OTP nodes.

# Backlog

## Backlog: First items to implement:

    - DONE: `Node` class, which constructs an object based on (erl),
      representing one runtime system 'node'
    
    - DONE: `Pid` class, which constructs an object based on the Erlang 'pid'
      datatype; remember to specify its toString; maybe specify parsePid as its
      inverse

    - DONE: `node.spawn/3` method, which returns the pid of a new 'lightweight
      process' started on a 'serl' node; the await ES keyword should be used in
      place of the receive Erlang keyword; use the 'arguments' object to
      implement arity=3, such that the other arities can be structurally
      implemente later

    - DONE: `proc.send/2` method, for sending messages; since send/3 doesn't
      change the position of the first two parameters, we don't have to check
      for arity here...

    - UNDONE: then do a test using the pingpong example in Erlang docs on
      message passing

