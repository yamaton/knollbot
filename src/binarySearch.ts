/*
Binary Search
*/

export const meguru = (xs: number[], f: ((x: number) => boolean)): number => {
  // meguru-like
  // https://qiita.com/hamko/items/794a92c456164dcc04ad
  let ng = -1;
  let ok = xs.length;
  while (ok - ng > 1) {
    let mid = Math.trunc((ng + ok) / 2);
    if (f(mid)) {
      ok = mid;
    } else {
      ng = mid;
    }
  }

  return ok;
}

export const bisect = (xs: number[], target: number): number => {
  return meguru(xs, (i) => (xs[i] >= target));
}


export const bisectLeft = (xs: number[], target: number): number => {
  return meguru(xs, (i) => (xs[i] > target));
}
