class Calculator {
  constructor(value) {
    this.value = (!value && value !== 0) ? NaN : value;
  }
  add(...args) {
    const initial = this.value || args.shift();
    const value = args.reduce((acc, cur) => Calculator._add(acc, cur), initial);
    return new Calculator(value);
  }

  minus(...args) {
    const initial = this.value || args.shift();
    const value = args.reduce((acc, cur) => Calculator._minus(acc, cur), initial);
    return new Calculator(value);
  }

  times(...args) {
    const initial = this.value || args.shift();
    const value = args.reduce((acc, cur) => Calculator._times(acc, cur), initial);
    return new Calculator(value);
  }

  divide(...args) {
    const initial = this.value || args.shift();
    const value = args.reduce((acc, cur) => Calculator._divide(acc, cur), initial);
    return new Calculator(value);
  }

  toFixed(n) {
    let symbol = '';
    const p = Math.pow(10, n);
    let num = this.value;
    if (this.value < 0) {
      symbol = num.toString().slice(0, 1);
      num = num.toString().slice(1);
    }
    num = Math.floor(new Calculator().times(num, p).add(0.5).done()) / p;
    return new Calculator(Number(`${symbol}${num}`));
  }

  done() {
    return this.value;
  }

  static _add(arg1, arg2) {
    const p = this.maxPrecision(arg1, arg2);
    return (this._times(arg1, p) + this._times(arg2, p)) / p;
  }
  static _minus(arg1, arg2) {
    const p = this.maxPrecision(arg1, arg2);
    return (this._times(arg1, p) - this._times(arg2, p)) / p;
  }
  static _times(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    // eslint-disable-next-line
    try { m += s1.split('.')[1].length || 0; } catch (e) { }
    // eslint-disable-next-line
    try { m += s2.split('.')[1].length || 0; } catch (e) { }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  }
  static _divide(arg1, arg2) {
    let p1 = 0;
    let p2 = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    // eslint-disable-next-line
    try { p1 = s1.split('.')[1].length || 0; } catch (e) { }
    // eslint-disable-next-line
    try { p2 = s2.split('.')[1].length || 0; } catch (e) { }
    return Number(s1.replace('.', '')) / Number(s2.replace('.', '')) * Math.pow(10, p2 - p1);
  }
  static maxPrecision(arg1, arg2) {
    let p1 = 0;
    let p2 = 0;
    try {
      p1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      p1 = 0;
    }
    try {
      p2 = arg2.toString().split('.')[1].length;
    } catch (error) {
      p2 = 0;
    }
    return 10 ** Math.max(p1, p2);
  }
}

export default new Calculator();
