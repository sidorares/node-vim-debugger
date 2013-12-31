node-vim-debugger
=================

Node.js debugger client and vim driver. Step-by-step debugging from vim.

install
============

```sh
npm install -g vimdebug
```

use
===

1) start your program with debugger enabled

```sh
node --debug-brk yourprogram.js
```

2) start agent

```sh
node-vim-inspector
```
3)
connect vim to agent:
```sh
vim -nb
```
or if you have vim already running, type `:nbs` in command mode

keys
====
  - <kbd>CTRL</kbd>+<kbd>c</kbd> - continue
  - <kbd>CTRL</kbd>+<kbd>i</kbd> - step in
  - <kbd>CTRL</kbd>+<kbd>o</kbd> - step over
  - <kbd>CTRL</kbd>+<kbd>n</kbd> - step next
  - <kbd>CTRL</kbd>+<kbd>u</kbd> - move one stack frame up
  - <kbd>CTRL</kbd>+<kbd>d</kbd> - move one stack frame down
  - <kbd>CTRL</kbd>+<kbd>b</kbd> - set breakpoint at current location

TODO:

  -do steps 1-3 from one vim command (`:ndebug` ?)
  - live edit
  - switch compiled js/original source
  - jump to symbol
  - eval balloons (only for GUI vim)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sidorares/node-vim-debugger/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

