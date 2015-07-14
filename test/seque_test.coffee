if typeof(window) == 'undefined'
  sinon = require 'sinon'
  Promise = require 'bluebird'
  chai = require 'chai'
  chai.should()
  require '../src/seque'

describe 'if(cond)..else..endif', ->
  it 'should run the next chained function conditionally', ->
    square = sinon.spy()
    cube = sinon.spy()
    tmp1 = [1..10]
    tmp1
      .if true
      .map square
      .endif()
    tmp2 = [1..10]
    tmp2
      .if false
      .map cube
      .endif()
    square.callCount.should.equal 10
    cube.callCount.should.equal 0
  it 'should skip to the endif', ->
    square = sinon.spy()
    cube = sinon.spy()
    tmp1 = [1..10]
    tmp1
      .if false
      .map square
      .endif()
      .map cube
    square.called.should.equal false
    cube.called.should.equal true
  it 'should handle multiple chained calls before the endif', ->
    spy1 = sinon.spy()
    spy2 = sinon.spy()
    spy3 = sinon.spy()
    tmp1 = [1..10]
    tmp1
      .if false
      .map spy1
      .map spy2
      .endif()
      .map spy3
    spy1.called.should.equal false
    spy2.called.should.equal false
    spy3.called.should.equal true
  it 'should work in plain Javascript', ->
    spy = sinon.spy()
    tmp1 = [1..10]
    `tmp1
      .if(false)
      .map(spy)
      .endif()
      .map(spy)`
    spy.callCount.should.equal 10
  it 'should be able to handle promise chains immediately', (done) ->
    @timeout 400
    p = new Promise (resolve, reject) -> setTimeout resolve, 200
    a = 0
    p
      .then -> a++
      .if a        # a is 0 here, because we're not waiting for the promise
      .then -> a++ # ... so this line gets skipped
      .endif()
      .then ->
        a.should.equal 1
        done()
  it 'should run else iff the if condition is false', ->
    spy1 = sinon.spy()
    spy2 = sinon.spy()
    spy3 = sinon.spy()
    spy4 = sinon.spy()
    tmp = [1..10]
    tmp
      .if true
      .map spy1
      .else()
      .map spy2
      .endif()
    tmp
      .if false
      .map spy3
      .else()
      .map spy4
      .endif()
    spy1.callCount.should.equal 10
    spy2.callCount.should.equal 0
    spy3.callCount.should.equal 0
    spy4.callCount.should.equal 10
  it 'should allow different object types to be chained with extraMethods', ->
    spy = sinon.spy -> 3
    x = {
      y: -> {
        z: spy
      },
      q: -> 5
    }
    x
      .if true, ['z']
      .y()
      .z()
      .else()
      .q()
      .endif()
      .should.equal 3
    spy.callCount.should.equal 1

describe 'loops', ->
  describe 'while(condFunc)..endwhile', ->
    it 'should loop while condFunc evaluates true', ->
      times2 = sinon.spy (x) -> x * 2
      loopCount = 5
      looper = -> loopCount--
      tmp = [1]
      tmp
        .while looper
        .map times2
        .endwhile()
        .should.deep.equal [32]
      times2.callCount.should.equal 5
    it 'should allow different object types to be chained with extraMethods', ->
      spy = sinon.spy -> x
      x = {
        y: -> {
          z: spy
        },
        q: -> 5
      }
      count = 5
      x
        .while (-> count--), ['z']
        .y()
        .z()
        .endwhile()
      spy.callCount.should.equal 5
  describe 'loop(n)..endloop', ->
    it 'should loop n times', ->
      times2 = sinon.spy (x) -> x * 2
      tmp = [1]
      tmp
        .loop 5
        .map times2
        .endloop()
        .should.deep.equal [32]
      times2.callCount.should.equal 5
    it 'should allow different object types to be chained with extraMethods', ->
      spy = sinon.spy -> x
      x = {
        y: -> {
          z: spy
        },
        q: -> 5
      }
      count = 5
      x
        .loop 5, ['z']
        .y()
        .z()
        .endloop()
      spy.callCount.should.equal 5

describe 'Promise handling', ->
  describe 'ifAsync', ->
    it 'should branch conditionally based on promise return value', (done) ->
      spy1 = sinon.spy()
      spy2 = sinon.spy()
      p1 = Promise.resolve true
        .ifAsync (x) -> x
        .then spy1
        .else()
        .then spy2
        .endif()
      p2 = Promise.resolve false
        .ifAsync (x) -> x
        .then spy2
        .else()
        .then spy1
        .endif()
      Promise.all [p1, p2]
        .then ->
          spy1.callCount.should.equal 2
          spy2.called.should.equal false
          done()
        .catch (err) ->
          done err
  describe 'whileAsync', ->
    it 'should loop conditionally based on promise return value', (done) ->
      count = 5
      spy = sinon.spy -> --count
      Promise.resolve true
        .whileAsync (x) -> x
        .then spy
        .endwhile()
        .then ->
          spy.callCount.should.equal 5
          done()
        .catch (err) ->
          done err

describe 'proxy version (if supported)', ->
  it 'should allow different object types to be chained', ->
    if typeof(Proxy) != 'undefined'
      x = {
        y: -> {
          z: -> 3
        },
        q: -> 5
      }
      x
        .if true
        .y()
        .z()
        .else()
        .q()
        .endif()
        .should.equal 3
    else
      console.log 'no proxy support'
