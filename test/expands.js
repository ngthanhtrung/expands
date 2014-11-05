'use strict';

var expand = require('..');

describe('expand', function () {
  it('should expand string correctly', function () {
    var ret = expand({
      message: 'Welcome {name}!',
      name: 'intruder'
    });

    expect(ret).to.have.property('message', 'Welcome intruder!');
  });

  it('should expand array correctly', function () {
    var ret = expand({
      messages: [
        'Welcome {name}!',
        'You are {age} years old.',
        12345
      ],
      name: 'intruder',
      age: 1000
    });

    expect(ret)
      .to.have.property('messages')
        .that.deep.equal([
          'Welcome intruder!',
          'You are 1000 years old.',
          12345
        ]);
  });

  it('should expand deep path correctly', function () {
    var ret = expand({
      foo: {
        bar: {
          one: '1',
          two: '2'
        },
        message: 'One is {foo.bar.one} and two is {foo.bar.two}.'
      }
    });

    expect(ret)
      .to.have.deep.property('foo.message')
        .that.equal('One is 1 and two is 2.');
  });

  it('should expand not found path as empty string', function () {
    var ret = expand({
      message: '{user.name} at {city.name}!',
      user: null
    });

    expect(ret)
      .to.have.property('message', ' at !');
  });

  it('should expand circle dependency correctly', function () {
    var ret = expand({
      a: 'from {b}',
      b: 'from {c}',
      c: 'from {a}'
    });

    expect(ret).to.have.property('a', 'from from from from ');
    expect(ret).to.have.property('b', 'from from from ');
    expect(ret).to.have.property('c', 'from from ');
  });
});
