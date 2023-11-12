// 参考答案 https://sicp-solutions.net/

const {time_spend, expmod, expmod1, expmod3} = require('./utility.js') ;

//============================ Exercise 1.3 ===============================
function square(a, b){
  return a*a + b*b;
}

function larger2squaresum(a, b, c){
  return (b>=a && c>=a) ? square(b, c)
      : (a>=b && c>=b) ? square(a, c) :square(a, b);
}

//=========================== Exercise 1.4 ================================

// P19 Square Roots by Newton’s Method
function abs(x){
  return x >= 0 ? x : -x;
}

function sqrtNewton(x){
  if(x<=0) {
    console.error("input x must be positive!");
  }
  let delta = 0.000000001;
  let y = 0.1;
  while (abs(y*y - x) > delta){
    y = (x/y + y)/2;
  }
  return y;
}

function sqrtNewtonRecur(x, guess){
  if (abs(guess * guess - x) < 1e-6){
    return guess;
  }
  return sqrtNewtonRecur(x, (guess + x/guess)/2);
}

//========================= Exercise 1.7 ==========================
// result shows that there is a significant improvement for the accuracy of very small x.
function isGoodEnough(oldGuess, newGuess){
  return abs(newGuess - oldGuess) < 1e-9;
}

function betterGuess(guess, x){
  return (guess + x/(guess+1e-9) )/2;
}

function sqrtNewton1(oldGuess, newGuess, x){
  return isGoodEnough(oldGuess, newGuess) ? oldGuess : sqrtNewton1(newGuess, betterGuess(newGuess, x), x);
}

//============================ Exercise 1.8 =========================
function betterGuessCube(guess, x){
  return (x/(guess*guess) + 2*guess)/3;
}

function rootNewtonCube(oldGuess, newGuess, x){
  return isGoodEnough(oldGuess, newGuess) ? oldGuess : rootNewtonCube(newGuess, betterGuessCube(newGuess, x), x);
}


/* =================================== section 1.2 ============================*/

function factorial1(n){
  return n === 1 ? 1 : n*factorial1(n-1);
}

function factorial2(n){
  function fac_iter(count, product){
    return count === n+1 ? product : fac_iter(count+1, count*product);
  }
  return fac_iter(1,1);
}

// fibonacci iterative process use recursion ：no stack memory needed to run.
function fib(n){
  function fib_iter(first, second, count){
    return (n < 3) ? 1 :
        (count === n) ? second :
            fib_iter(second, first + second, count+1);
  }
  return fib_iter(1,1,2);
}

// fibonacci tree recursion function : going through fully expansion then reduce process.
// need stack to run.
function fib_recur(n){
  return n < 3 ? 1 : fib_recur(n-1) + fib(n-2);
}

//============================ P34 Example: Counting change======================
//写好递归，从这个题的经验来看就是，要考虑清楚degenerate cases。只有考虑清楚递归退出的情形以及这些情形需要哪些状态描述，就能比较简单的写出程序（递归状态演进）。
function ways_to_change(arr, amount){
  // arr.sort();
  let n = arr.length;
  function change_iter(n, amount){
    return amount === 0 ?
        1 : amount < 0 || n === 0 ?
                0 : change_iter(n,amount - arr[n-1])+change_iter(n-1, amount);
  }
  return change_iter(n, amount);
}

//============================ Exercise 1.11 ======================

// recursive process: top down!
function f_recur(n){
  return n < 3 ?
      n : f_recur(n-1) + 2* f_recur(n-2) + 3* f_recur(n-3);
}

// iterative process: bottle up!
function f_i(n){
  function f_iter(count, a, b, c){
    return count === n ? c : f_iter(count+1, b, c, 3*a+2*b+c);

  }
  return n === 0 ? 0 :
      n === 1 ? 1 :
          n === 2 ? 2 :
  f_iter(2, 0, 1, 2);
}

//============================ Exercise 1.12 ========================
// 计算杨辉三角
function pascal(n, m){
  return n===1 || m===1 ? 1 :
      n===m ? 1 :
          pascal(n-1, m-1) + pascal(n-1, m);
}

//============================ Exercise 1.16 ========================
function fast_exp(b, n){
  function exp_i(b, n, mult){
    return n === 1 ?  b * mult :
        n % 2 === 0 ? exp_i(b*b, n/2, mult) : exp_i(b*b, (n-1)/2, b*mult)
  }
  return exp_i(b, n, 1);
}

//============================ Exercise 1.17 ========================
function double(x){
  return x+x;
}

function halve(x){
  return x/2;
}

function fast_multiply(base, time){
  return time === 1 ? base :
      time % 2 === 0 ? fast_multiply(2*base, halve(time)) :
          base + fast_multiply(2*base, halve(time - 1));
}


//============================ Exercise 1.18 ========================
function multiply_iter(a, b, addon){
  return b === 1 ? a + addon :
      b % 2 === 0 ? multiply_iter(double(a), halve(b),addon) :
          multiply_iter(double(a), halve(b-1), a+addon);
}


//============================ 1.2.5 ========================
function find_gcd(a, b){
  return b === 0 ? a : find_gcd(b, a % b);
}

//========================= 1.2.6 Testing for Primality ====================
function isPrime(n){
  function iter(n, i){
    return n % i === 0 ? false :
        i > sqrtNewton(n) ? true : iter(n, i+1);
  }
  return n===1 ? false :
      n === 2 ? true :
      iter(n,2);
}

// Determine primality using fermat test:
// if n | a^(n-1) - 1, a < n, then n is very likely to be a prime.
// run this test for certain times.

function fermat_test(n, time){

  function iter(t, isPrime){
    // randomly pick a from [1,n-1]
    const a = Math.floor(Math.random() * (n - 1)) + 1;
    // 暴力计算次幂很容易溢出，需要注意
    const exp = ( expmod3(a, n, n) === a )
    return t === 0 ? isPrime :
        iter(t-1, isPrime && exp);
  }

  return iter(time, true);
}

//============================ Exercise 1.21 ========================
function smallest_divisor(n){
  // the smallest divisor must not bigger than sqrt(n).
  let search_limit = Math.floor(sqrtNewton(n));
  function iter(divisor){
    return n % divisor === 0 ? divisor :
        divisor > search_limit ? n :
            iter(divisor+1);
  }
  return iter(2);

}



// ============================ Exercise 1.22 ======================
function smallest_prime_above(n){
  return isPrime(n) ? n : smallest_prime_above(n+1);
}

function get_m_prime_above(n, m){
  let next_prime= smallest_prime_above(n);
  console.log(next_prime);
  return  m === 1 ? NaN : get_m_prime_above(next_prime+1, m-1);
}

// ============================ Exercise 1.23 ======================
function smallest_divisor1(n){
  // the smallest divisor must not bigger than sqrt(n).
  let search_limit = Math.floor(sqrtNewton(n));
  function next(divisor){
    return divisor === 2 ? 3 : divisor + 2;
  }
  function iter(divisor){
    return n % divisor === 0 ? divisor :
        divisor > search_limit ? n :
            iter(next(divisor));
  }
  return iter(2);
}

// ============================ Exercise 1.26 ======================
// this exercise say there is a big difference between expmod(base, r/2, m) * expmod(base, r/2, m) and square(expmod(base, r/2, m)).
// results show that there did have a difference.
// the interpreter uses applicative-order evaluation, meaning it will “evaluate the arguments and then apply”.
function square1(a){
  return a*a;
}

function expmod2(base, r, m){
  return r === 0 ? 1 :
      r % 2 === 0 ? square1( expmod2(base, r/2, m) ) % m:
          base * ( square1( expmod2(base, (r-1)/2, m) ) ) % m;
}

function fermat_test1(n, time){

  function iter(t, isPrime){
    // randomly pick a from [1,n-1]
    const a = Math.floor(Math.random() * (n - 1)) + 1;
    // 暴力计算次幂很容易溢出，需要注意
    const exp = ( expmod1(a, n, n) === a )
    return t === 0 ? isPrime :
        iter(t-1, isPrime && exp);
  }

  return iter(time, true);
}

// ============================ Exercise 1.27 ======================
// output first n  carmichael number.
// carmichael number is a prime but can pass fermat's test.
// The smallest few are 561, 1105, 1729, 2465, 2821, and 6601.
function carmichael_numbers(n){

  function find_carmichael_number_above(m){
    return fermat_test1(m)===1 && !isPrime(m) ? m :
        find_carmichael_number_above(m+2);
  }

  function iter(time, carm){
    console.log(carm);
    return time === 1 ? NaN : iter(time-1, find_carmichael_number_above(carm+2));
  }

  return iter(n, 561);
}

// ============================ Exercise 1.28 ======================
/* Miller-Rabin质数测试
Carmichael numbers 561, 1105, 1729, 2465, 2821, and 6601
费马小定理+二次探测；
二次探测定理：对于a<n, 且a^2 === 1 (mod n), 若n为素数， 则必有 a===1 或 a===n-1。
由此可知：若 a !== 1 且 a !== n-1, 但是 a^2 === 1 (mod n)，则 n 为合数。
 */
function expmodChecked(base, exp, m){

  if(exp === 0){ return 1; }
  if(exp % 2 === 0){
    return remainderSquareChecked(expmodChecked(base, exp/2, m), m);
  }else{
    return base * expmodChecked(base, exp-1, m) % m;
  }
}

function remainderSquareChecked(x, m){
  // 对square root 进行二次探测:
   if( x !== 1 && x !== m-1 && Math.pow(x, 2) % m ===1 ){
     return 0;
   }else {
     return Math.pow(x, 2) % m;
   }
}

function millerRabinTest(n, count){
  let base = Math.floor(Math.random() * (n-1) ) + 1;
  let result = true;
  for(let i=0; i<count; i++){
    result = result && (expmodChecked(base, n-1, n)=== 1);
  }
  return result ? 1 : 0;
}

// ============================ Exercise 1.29 1.30 ======================
function sum(f, a, next, b){
  if(a > b){
    return 0;
  }
  return f(a) + sum(f, next(a), next, b)
}

function sumIter(f, a, next, b){
  function iter(a, sum_result){
    return a > b ?
        sum_result : iter(next(a), sum_result + f(a));
  }
  return iter(a, 0)
}


//求积分方法1：Simpson‘s Rule
function simpsonIntegral(f, a, b, n){
  const h = (b-a) / n;
  const next = (x => x+h);
  return (h/3) * (sumIter(f, a, next, b) + sumIter(f, a+h, next, b-h) + 2 * sumIter(f, a+h, x => x+2*h, b))
}

//求积分方法2：牛顿-莱布尼兹
function integral(f, a, b, n){
  const dx = (b-a)/n;
  return dx * sumIter(f, a+dx/2, x=>x+dx, b);
}


// ============================ Exercise 1.31 ======================

function product(f, a, next, b){
  function iter(a, result){
    return a > b ? result : iter(next(a), f(a)*result)
  }
  return iter(a, 1);
}

function factorial(n){
  return product(x=>x, 1, x=>x+1, n);
}

function getPi(n){
  const f = x => ( x/(x+1) )
  const g = x => ( (x+2)/(x+1))
  const next = x => x+2
  return product(f,2,next,n) * product(g,2,next,n) * 4
}

// ============================ Exercise 1.32 && 1.33============================
function accumulate(combiner, baseValue, f, a, next, b){
  if (a > b) return baseValue;
  function iter(a, result){
    return a > b ? result:
       iter(next(a), combiner(result, f(a)));
  }
  return iter(a, baseValue)
}

function filtered_accumulation(combiner, filter, baseValue, f, a, next, b){
  function iter(a, result){
    return a > b ? result :
        // any excess arguments are simply ignored by the function. This behavior is sometimes referred to as "function overloading."
        filter(a, b) ? iter(next(a), combiner(f(a), result)) :
            iter(next(a), result);
  }
  return iter(a, baseValue);
}

// ============================ Exercise 1.34 ============================
function f(g){
  return g(2)
}

// trace the evaluation of f(f): f(f(2))=>f(2(2)). since 2 is not a function, so a type error would occur.


// =============== Page 58: Find roots of equations by the half-interval method ====================

function half_interval_method(f, a, b, tolerance){
  function searchRoot(a, b){
    return b-a < tolerance ? (a+b) /2 :
        f((b + a)/2) === 0 ? (a+b) /2 :
            f((b + a)/2)   > 0 ? searchRoot(a, (b + a)/2) :
                searchRoot((b + a)/2, b)
  }
  const val_a = f(a);
  const val_b = f(b);
  return val_a > 0 && val_b < 0 ? searchRoot(val_b, val_a) :
         val_a < 0 && val_b > 0 ? searchRoot(val_a, val_b) :
             "Error: values are not of opposite sign"
}

// =============== Page 60: fixed point ====================
// find x that f(x)=x. start from a random guess until converge (next(x)-x is very small).
// 不是所有的方程都可以通过该方法求得f(x)=x根。
function fixed_point(f, guess, tolerance){
  return Math.abs(f(guess) - guess) < tolerance ? guess :
      fixed_point(f, ( f(guess) + guess)/2, tolerance)
}

function fixed_point1(f, guess, tolerance){
  return Math.abs(f(guess) - guess) < tolerance ? guess :
      fixed_point(f, f(guess), tolerance)
}

function fixed_point_bisection(f, guess, tolerance){
  let high = guess + 1;
  let low  = guess - 1;
  function recur(low, high){
    let mid = (high + low)/2;
    let f_mid = f(mid)
    if(Math.abs(f_mid - mid) < tolerance) return mid
    if(f_mid > mid) recur(low, mid);
    if(f_mid < mid) recur(mid, high);
  }
  return recur(low, high)
}


// =============== exercise 1.37 ====================
function cont_frac_recur(n, d, k){
  function recur(i){
    //if i === k, then truncation to N_K/D_K
    return i === k ? n(k)/d(k) : n(i)/(d(i) + recur(i+1))
  }
  return recur(1)
}

function cont_frac_iter(n, d, k){
  function iter(i, result){
    return i === 1 ? result :
        iter(i-1, n(i-1)/(d(i-1) + result))
  }
  return iter(k, n(k)/d(k) )
}

// =============== exercise 1.38 ====================
function d(i){
  return i % 3 === 2 ? (2*i + 2)/3 : 1
}

// =============== exercise 1.39 Approximation of tangent function：Lambert’s formula ===============
function tangent_iter(n, d, k){
  function iter(i, result){
    return i === 1 ? result :
        iter(i-1, n(i-1)/(d(i-1) - result))
  }
  return iter(k, n(k)/d(k) )
}

function tan_cf(x, k){
  return tangent_iter(i=>Math.pow(x,2), i=>2*i-1, k) / x
}

/* =============================== P64 Newton’s method ===============================*/
const torelance = 0.0001
const dx = 0.00001

function fixedPoint(f, guess){
  return Math.abs(f(guess) - guess) < torelance ? guess : fixedPoint(f, f(guess))
}

function deriv(g){
  return x => (g(x+dx) - g(x))/dx
}

function newton_method(f, guess){
  return fixedPoint(x=> x- f(x)/deriv(f)(x), guess)
}

function sqrt(x){
  return newton_method(y => Math.pow(y, 2) - x, 1)
}

/* =================================== Exercise 1.40  ===============================*/
function cubic(a, b, c){
  return x => x*x*x + a*x*x + b*x + c
}

function solveCubicEq(a, b, c){
  return newton_method(cubic(a, b, c), 1)
}

function solveQuadraticEq(a, b, c){
  if((Math.pow(b,2) - 4*a*c) < 0) return
  return newton_method(x => a*Math.pow(x, 2) + b*x +c, 0)
}

/* =================================== Exercise 1.41  ===============================*/
function double1(f){
  return x => f(f(x))
}
const inc = x => x+1
// console.log( double1(double1(double1))(inc)(5)) //=>21
// console.log( double1(double1(double1(double1)))(inc)(5) ) //=>261


/* =================================== Exercise 1.42  ===============================*/
function compose(f, g){
  return x => f(g(x))
}
//console.log(compose(x=>x*x, inc)(6))

/* =================================== Exercise 1.43  ===============================*/
function repeated(f, n){
  return n===1 ? f :
      compose(f, repeated(f, n-1))
}

/* =================================== Exercise 1.44  ===============================*/
function smooth(f){
  return x=> (f(x-dx) + f(x) + f(x+dx))/3
}

/* ========================== Exercise 1.45  computing nth roots ===============================*/
function averageDump(f){
  return x=> (x+f(x))/2
}

function getRoot(x, n){
  const k = Math.floor(Math.log2(n)) // k is the repeat times of averageDump needed to converge
  const kAverageDump = repeated(averageDump, k)
  return fixedPoint(kAverageDump(y=> x/Math.pow(y,n-1)), 1)
}

/* =================================== Exercise 1.44  ===============================*/
function iterative_improvement(isGoodEnough, improvedGuess){
  return guess => {
    while( !isGoodEnough(guess)){
      guess = improvedGuess(guess)
    }
    return guess
  }
}

function sqrt4(x){
  const guess = 1
  const f = y => x/y
  const isGoodEnough = (guess) => {return Math.abs(f(guess) - guess) < torelance}
  const improvedGuess = (guess) => (f(guess) + guess)/2

  return iterative_improvement(isGoodEnough, improvedGuess)(guess)
}

function fixed_point4(f){
  // transform f, f is equation to be solved
  // to find the fixed point of cos(x)=> f(x)=cos(x)-x
  const g = x=> x- f(x)/deriv(f)(x)
  const guess = 1
  const isGoodEnough = (guess) => {return Math.abs(g(guess) - guess) < torelance*0.01}
  const improvedGuess = (guess) =>  g(guess)
  return iterative_improvement(isGoodEnough, improvedGuess)(guess)
}

/* =================================== Test ===============================*/
// console.log(fixed_point4(x=>Math.cos(x)-x))






module.exports = {find_gcd}








