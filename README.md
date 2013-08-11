node-vim-debugger
=================

Node.js debugger client and vim driver. Step-by-step debugging from vim.

install
============

```sh
npm instqll -g vimdebug
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

TODO:
do steps 1-3 from one vim command (`:ndebug` ?)
