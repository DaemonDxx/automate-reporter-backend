export class RangeNumber {
  from: number;
  to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  [Symbol.iterator]() {
    let start = this.from;
    const end = this.to;
    return {
      next() {
        if (start > end) return { done: true };
        return {
          value: start++,
          done: false,
        };
      },
    };
  }
}
