const {find_gcd} = require("./chapter1.js");

// 在做第一章练习的时候，发现没有类型检查太容易犯一些莫名其妙的错误，例如js不提示参数数量不匹配，因此改为typeScript。

// ===================== Exercise 2.1 ====================

function pair(head:number, tail:number){
    return {
        head: head,
        tail: tail,
    }
}

type Rational = {head:number, tail:number}

function make_rat(n:number, d:number): Rational{
    let sign :number = d / Math.abs(d)
    const gcd = Math.abs(find_gcd(n, d))
    n = n/gcd
    d = d/gcd
    return pair(n*sign,d*sign)
}

// for display
function rat2str(x :Rational):string{
    return `${x.head}/${x.tail}`
}

// operations: +, -, *, /, ===
function add_rat(x: Rational, y: Rational): Rational{
    const head = x.head * y.tail + x.tail * y.head
    const tail = x.tail * y.tail
    return make_rat(head, tail)
}

function sub_rat(x: Rational, y: Rational): Rational{
    const head = x.head * y.tail - x.tail * y.head
    const tail = x.tail * y.tail
    return make_rat(head, tail)
}

function mul_rat(x: Rational, y: Rational): Rational{
    const head = x.head * y.head
    const tail = x.tail * y.tail
    return make_rat(head, tail)
}

function div_rat(x: Rational, y: Rational): Rational{
    const head = x.head * y.tail
    const tail = x.tail * y.head
    return make_rat(head, tail)
}

function equ_rat(x: Rational, y: Rational): boolean{
    return x.head * y.tail === x.tail * y.head
}


// ===================== Exercise 2.2 ====================
// represent segment in a plane.
type Point = {
    x : number,
    y : number,
}

type Segment = {
    startPoint : Point,
    endPoint : Point
}

function make_point(x: number, y:number):Point{
    return {x : x, y: y}
}

function print_point(p: Point) : void{
    console.log(`(${p.x}, ${p.y})`)
}

function make_segment(p1: Point, p2: Point): Segment{
    return {startPoint: p1, endPoint: p2}
}

function midpoint_segment(seg: Segment): Point{
    const mid_x = (seg.startPoint.x + seg.endPoint.x)/2
    const mid_y = (seg.startPoint.y + seg.endPoint.y)/2
    return make_point(mid_x, mid_y)
}

// ===================== Exercise 2.3 ====================

type Rectangle = {
    upLeftPoint : Point,
    downRightPoint : Point,
}

function make_rect(p1: Point, p2: Point){
    return {
        upLeftPoint : p1,
        downRightPoint : p2,
    }
}

function perimeter(rect : Rectangle): number{
    return 2* Math.abs(rect.upLeftPoint.x-rect.downRightPoint.x) +
        2* Math.abs(rect.upLeftPoint.y-rect.downRightPoint.y)
}

function area(rect : Rectangle): number{
    return Math.abs(rect.upLeftPoint.x-rect.downRightPoint.x) *
        Math.abs(rect.upLeftPoint.y-rect.downRightPoint.y)
}

// ===================== Exercise 2.4 ============================
// PairFunction is a function that take as argument a function f and output any type; and f take two arguments of type any and output any.
type PairFunction = (f: (a: any, b:any) => any) => any

function pair1(x: any, y: any): PairFunction {
    // pair1 output a PairFunction that takes in a function m and output any
    return (m: (p:any, q:any) => any) => m(x, y)
}

function head(z: PairFunction): any {
    return z( (p, q) => p)
}

function tail(z:PairFunction): any {
    return z( (p, q) => q)
}

// ===================== Exercise 2.5 ============================

function pair2(x: number, y: number): number{
    return Math.pow(2, x) * Math.pow(3, y)
}

function head2(n : number): number {
    let result = 0;
    while(n % 2 === 0){
        result ++;
        n /= 2;
    }
    return result
}

function tail2(n : number): number {
    let result = 0;
    while(n % 3 === 0){
        result ++;
        n /= 3;
    }
    return result
}

// ===================== Exercise 2.6 ============================
/*
Explain of zero、one:
1. zero is function that takes in a function f
2. zero returns a function that output what it takes in.
==> zero applied f 0 times.
it's easy to see that add_1(zero)(x) === f(x)
from zero and add_1 it can be inferred one means apply f 1 time
 */
const zero = (f: any) => (x:any):any => x;
const one = (f: any) => (x: any): any => f(x);
const two = (f: any) => (x: any): any => f(f(x));
const three = (f: any) => (x: any): any => f(f(f(x)));

function add(m:any, n:any):any{
    return (f:any) => (x: any): any => n(f)(m(f)(x))
}
function multiply(m:any, n:any):any{
    return (f:any) => (x: any): any => n(m(f))(x)
}

function test26(): void{
    console.log(zero((x:number):number=>x*2)(5))
    console.log(two((x:number):number=>x*2)(5))
    const oneplustwo = add(one, two)
    const twoplusthree = add(two, three)
    const twomulthree = multiply(two, three)
    console.log(oneplustwo((x:number):number=>x*2)(5))
    console.log(twoplusthree((x:number):number=>x*2)(5))
    console.log(twomulthree((x:number):number=>x*2)(5))
}


/*=====================    Interval  Arithmetic ===================*/
//  Exercise 2.7
type Interval = {
    lower_bound : number,
    upper_bound : number,
}
function make_interval(x: number, y:number): Interval{
    return {
        lower_bound: x,
        upper_bound: y
    }
}

//  Exercise 2.8
function sub_interval(x: Interval, y: Interval): Interval{
    const lower_bound: number = x.lower_bound - y.upper_bound
    const upper_bound: number = x.upper_bound - y.lower_bound
    return make_interval(lower_bound, upper_bound)
}

//  Exercise 2.10
function getMin(arr: Array<number>): number{
    let min: number = arr[0]
    for(const i of arr){
        if(i< min) min = i
    }
    return min
}

function getMax(arr: Array<number>): number{
    let max: number = arr[0]
    for(const i of arr){
        if(i > max) max = i
    }
    return max
}

function mul_interval(x: Interval, y: Interval): Interval{
    const p1: number = x.lower_bound * y.lower_bound
    const p2: number = x.lower_bound * y.upper_bound
    const p3: number = x.upper_bound * y.lower_bound
    const p4: number = x.upper_bound * y.upper_bound
    const min: number = getMin([p1, p2, p3, p4])
    const max: number = getMax([p1, p2, p3, p4])
    return make_interval(min, max)
}

function div_interval(x: Interval, y: Interval): Interval|void{
    if(y.lower_bound * y.upper_bound === 0){
        console.log("divisor can not be zero!")
        return
    }
    return mul_interval(x,
        make_interval(
            1/y.upper_bound,
            1/y.lower_bound,
        ))

}

// exercise 2.12
function make_center_percent(center:number, percent_tolerance:number): Interval{
    const lower_bound = center * (1 - percent_tolerance)
    const upper_bound = center * (1 + percent_tolerance)
    return make_interval(lower_bound, upper_bound)
}

function get_percent(interval: Interval){
    const center: number = (interval.lower_bound + interval.upper_bound)/2
    const percent: number = Math.abs((interval.upper_bound - center)/center)
    return percent
}


/*=====================    Page 86：From Pair to List ===================*/
type Pair = {
    head: any,
    tail: any
} | null

type List = Pair;

function pair3(head: any, tail: any): Pair{
    return {
        head: head,
        tail: tail
    }
}

// build list use list function
function list(arr: Array<any>): List{
    let li: List = null
    const len = arr.length
    for(let i= len-1; i>=0; i--){
        li = pair3(arr[i], li)
    }
    return li
}

function head3(p: Pair): any{
    return p!.head
}

function tail3(p: Pair): any{
    return p!.tail
}


// returns the nth item of the list.
function list_ref(li: List, n: number): any{
    return n === 0 ? head3(li) :
        list_ref(tail3(li), n-1)
}

// get list length
function len(li: List): number{
    return li === null ? 0 :
        1 + len(tail3(li))
}

// print list as nested pairs or as array
// only works for list of primitive type
function print_list(asArray: boolean = false, li: List): void{
    if(asArray){
        console.log(list2arry(li))
    }else{
        let s = "";
        let e = "";
        const n = len(li);
        for(let i=0; i<n; i++){
            s += `[${list_ref(li, i)},`
            e += "]"
        }
        console.log(s+"null"+e)
    }
}

function list2arry(li: List): Array<any>{
    let arr: Array<any> = Array();
    const n = len(li)
    for(let i=0; i<n; i++){
        arr.push(list_ref(li, i))
    }
    return arr
}

function list_append(left: List, right: List):List{
    if (left === null) return right
    return pair3(head3(left), list_append(tail3(left), right))
}

/*=====================  Exercise 2.17 2.18 ===================*/
function last_pair(li: List): List{
    return list([list_ref(li, len(li)-1)])
}

function reverse(li: List): List{
    if(li === null) return null
    let result_list: List = null
    for(let i=len(li)-1; i>=0; i--){
        result_list = list_append(result_list, list([list_ref(li, i)]))
    }
    return result_list
}

/*=====================  Exercise 2.19 ===================*/

function count_change(total_amount: number, coins: List): number{
    return total_amount < 0 ? 0 :
        total_amount === 0 ? 1 :
            len(coins) === 0 ? 0 :
                count_change(total_amount - head3(coins), coins) +
                count_change(total_amount, tail3(coins))
}

// ================================ test ==========================
const us_coins = list([25, 50, 10, 5, 1]);
const uk_coins = list([100, 50, 20, 10, 5, 2, 1]);
console.log(count_change(100, us_coins))




