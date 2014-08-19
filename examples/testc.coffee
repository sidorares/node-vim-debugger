f = (t) ->
  g = t + 1
  b = g if true
  d = c?.d
  debugger
  g + 5




















module.exports = (x) ->
  cp = require.resolve('coffee-script')
  x += 1
  console.log('line3')
  debugger
  console.log('line5')
  b = 6
  console.log('line7')
  console.log('line8')
  a = 5
  console.log('line10')
  x + 5  - f(5)
