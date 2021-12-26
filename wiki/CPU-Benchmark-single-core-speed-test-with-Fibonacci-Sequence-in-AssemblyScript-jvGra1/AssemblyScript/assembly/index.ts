// The entry file of your WebAssembly module.

export function test(): i64[] {
  let tmp: i64, a: i64 = 0, b: i64 = 1;

  const t1: i64 = Date.now();

  for (let i: i64 = 0; i < 10000; ++i) {
      for (let j: i64 = 0; j < 1000000; ++j) {
          tmp = b;
          b = a + b;
          a = tmp;
      }
  }

  const t2: i64 = Date.now();
  const dt: i64 = t2 - t1;

  return [dt, b];
}