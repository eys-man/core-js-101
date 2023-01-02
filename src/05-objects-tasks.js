/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return (this.width * this.height);
  };
}

/*
Rectangle.prototype = function getArea() {
  return (this.width * this.height);
};
*/


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);

  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// class cssSelectorBuilder {
//   constructor() {
//     this.numId = 0;
//     this.numPseudoClass = 0;
//     this.str = [];
//   }

//   element(value) {
//     return this.str.push('div').push(value);
//   }

//   id(value) {
//     this.numId += 1;
//     return this.str.push('#').push(value);
//   }

//   class(value) {
//     return this.str.push('.').push(value);
//   }

//   attr(value) {
//     return this.str.push('[').push(value).push(']');
//   }

//   pseudoClass(value) {
//     this.numPseudoClass += 1;
//     return this.str.push(':').push(value);
//   }

//   pseudoElement(value) {
//     return this.str.push('::').push(value);
//   }

//   combine(selector1, combinator, selector2) {
//     return this.element(selector1).push(combinator).push(this.element(selector2));
//   }

//   stringify() {
//     return JSON.stringify(this.str);
//   }
// }

class My {
  constructor(value, ident) {
    this.value = value;
    this.ident = ident;
  }
}

const cssSelectorBuilder = {
  element(value) {
    if (this.ident === 'element') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (this.ident !== undefined) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const ident = 'element';
    return new My(value, ident);
  },

  id(value) {
    if (this.ident === 'id') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    } else if (this.ident === 'pseudo' || this.ident === 'class' || this.ident === 'attr' || this.ident === 'psclass') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const ident = 'id';
    let newValue;
    if (this.value) {
      newValue = `${this.value}#${value}`;
    } else {
      newValue = `#${value}`;
    }
    return new My(newValue, ident);
  },

  class(value) {
    if (this.ident === 'pseudo' || this.ident === 'attr' || this.ident === 'psclass') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const ident = 'class';
    let newValue;
    if (this.value) {
      newValue = `${this.value}.${value}`;
    } else {
      newValue = `.${value}`;
    }
    return new My(newValue, ident);
  },

  attr(value) {
    if (this.ident === 'pseudo' || this.ident === 'psclass') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const ident = 'attr';
    let newValue;
    if (this.value) {
      newValue = `${this.value}[${value}]`;
    } else {
      newValue = `[${value}]`;
    }
    return new My(newValue, ident);
  },

  pseudoClass(value) {
    if (this.ident === 'pseudo') {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const ident = 'psclass';
    let newValue;
    if (this.value) {
      newValue = `${this.value}:${value}`;
    } else {
      newValue = `:${value}`;
    }
    return new My(newValue, ident);
  },

  pseudoElement(value) {
    if (this.ident === 'pseudo') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const ident = 'pseudo';
    let newValue;
    if (this.value) {
      newValue = `${this.value}::${value}`;
    } else {
      newValue = `::${value}`;
    }
    return new My(newValue, ident);
  },

  combine(selector1, combinator, selector2) {
    const a = selector1.stringify();
    const b = selector2.stringify();
    const combVal = `${a} ${combinator} ${b}`;
    return new My(combVal, 'no');
  },

  stringify() {
    return this.value;
  },
};

Object.assign(My.prototype, cssSelectorBuilder);

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
