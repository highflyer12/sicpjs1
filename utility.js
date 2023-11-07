function time_spend(){
  // beg_time = new Date().getTime();
  const beg_time = performance.now();
  // 类方法保存在prototype中
  const args = Array.prototype.slice.call(arguments);
  const f = args[0];
  // 如果不使用扩展操作符，想把定义在这个函数这面的数组拆分，那么就得求助于apply()方法
  // ES 6可以使用扩展操作符将可迭代对象拆分，将迭代返回的每个值单独传入。
  // let ret = f(...args.slice(1, args.length))
  // apply()和call()真正强大的地方并不是给函数传参，而是控制函数调用上下文即函数体内this值的能力。
  let ret = f.apply(this, args.slice(1, args.length));
  const end_time = performance.now();
  // end_time = new Date().getTime();
  console.log("the output of %s is %d.", f.name, ret);
  console.log("Function %s spent %d ms at one run.", f.name, end_time - beg_time);
}

//需要避免溢出。a^b mod c === (a mod c)^b mod c.（多项式展开即可证明）
// 书上的写法利用 ab mod c === (a mod c) * (b mod c)
// 这里的expmod有错误！
function expmod(base, r, m){
  return r === 0 ? 1 :
      r % 2 === 0 ? expmod((base * base % m), r/2, m) % m :
          ( base * expmod((base * base) % m, (r - 1)/2, m) )% m;
}

// 书上的写法
function expmod3(base ,r ,m){
  return r === 0 ? 1 :
      r % 2 === 0 ? expmod3(base, r/2, m) * expmod3(base, r/2, m) % m :
          base * expmod3(base, r-1, m) % m;
}

function expmod1(base ,r ,m){
  return r === 0 ? 1 :
      r % 2 === 0 ? expmod1(base, r/2, m) * expmod1(base, r/2, m) % m :
          base * expmod1(base, (r-1)/2, m) * expmod1(base, (r-1)/2, m) % m;
}

module.exports =  {time_spend, expmod1, expmod3};
