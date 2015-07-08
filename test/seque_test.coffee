sinon = require 'sinon'
Promise = require 'bluebird'
chai = require 'chai'
chai.should()

require '../dist/seque'

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
