[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=sidorares&url=https://github.com/sidorares/node-vim-debugger&title=node-vim-debugger&language=&tags=github&category=software) 

node-vim-debugger
=================

Node.js debugger client and vim driver. Step-by-step debugging from vim.

![vimdebug](https://cloud.githubusercontent.com/assets/173025/3963425/7c2322b0-277b-11e4-8bd0-506fe8f9ba8a.gif)

### install

```sh
npm install -g vimdebug
```

### usage

1) start your program with debugger enabled

```sh
node --debug-brk yourprogram.js
```

2) start agent

```sh
node-vim-inspector
```

Instead of steps 1-2 you can just do `node-vim-inspector yourprogram.js` and it'll spawn and attach automatically

3)
connect vim to agent:
```sh
vim -nb
```
or if you have vim already running, type `:nbs` in command mode

### keys

  - <kbd>CTRL</kbd>+<kbd>c</kbd> - continue
  - <kbd>CTRL</kbd>+<kbd>i</kbd> - step in
  - <kbd>CTRL</kbd>+<kbd>o</kbd> - step over
  - <kbd>CTRL</kbd>+<kbd>n</kbd> - step next
  - <kbd>CTRL</kbd>+<kbd>u</kbd> - move one stack frame up
  - <kbd>CTRL</kbd>+<kbd>d</kbd> - move one stack frame down
  - <kbd>CTRL</kbd>+<kbd>b</kbd> - set breakpoint at current location


### Links

  - [V8 Debugger protocol wire format](https://code.google.com/p/v8/wiki/DebuggerProtocol)
  - [debugger documentation (deprecated)](http://nodejs.org/api/debugger.html)
  - [node-inspector](https://github.com/node-inspector/node-inspector)
  - [webkit-agent](https://github.com/c4milo/node-webkit-agent)
  - [node-cli-debugger](https://github.com/sidorares/node-cli-debugger)
  - [debugger protocol node client](https://github.com/sidorares/v8-debugger-protocol)
  - [ndb](https://github.com/smtlaissezfaire/ndb)
  - [node-profiler](https://github.com/bnoordhuis/node-profiler)
  - [v8.log processor](https://github.com/sidorares/node-tick)
