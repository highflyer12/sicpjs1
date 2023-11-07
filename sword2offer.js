//============================== Question 1 ============================
// 题目：输入2个int型整数，它们进行除法计算并返回商，要求不得使用乘号'*'、除号'/'及求余符号'%'。当发生溢出时，返回最大的整数值。假设除数不为0。例如，输入15和2，输出15/2的结果，即7。
// 假设 MAX_POSITIVE_INT = 0x7fffffff，MAX_NEGATIVE_INT = 0x80000000.
let POSITIVE_INT_LIMIT = 0x7fffffff;
let NEGATIVE_INT_LIMIT = 0x80000000; // 0x80000000的一半是0xc0000000。

function divide(dividend, divisor){
  // 处理除数为0情况
  if(divisor === 0){
    console.error("divisor cant be 0!");
  }
  // 处理溢出情况，即最小负数/-1
  if(dividend === POSITIVE_INT_LIMIT && divisor === -1){
    return POSITIVE_INT_LIMIT;
  }
  // 转为负数，之所以不转正数是因为最小的负数转正数会溢出！
  let sign = ((dividend > 0) && (divisor > 0) || (dividend <= 0) && (divisor <= 0)) ? 1 : -1;
  dividend = dividend >= 0 ? -dividend : dividend;
  divisor = divisor >= 0 ? -divisor : divisor;

  let quotient = divide_core(dividend, divisor) * sign;
  return quotient;
}

function divide_core(dividend, divisor){
  let result = 0;
  // 如果 dividend > divisor 则结果为0.
  while(dividend <= divisor){
    // 通过循环找到当前循环可承受的最大2次幂倍
    let quotient = 1;
    let value = divisor;
    while(value >= 0xc0000000 && dividend <= value + value){
      value = value + value;
      quotient = quotient + quotient;
    }
    result += quotient;
    dividend -= value;
  }
  return result;
}

/*============================== Question 2 ============================
题目：输入两个表示二进制的字符串，请计算它们的和，并以二进制字符串的形式输出。例如，输入的二进制字符串分别是"11"和"10"，则输出"101"。

二进制的位运算并不是很难掌握，因为位运算只有6种：非、与、或、异或、左移和右移
 */

function addBinary(str1, str2) {
  if (str1.length < str2.length) {
    let temp = str1;
    str1 = str2;
    str2 = temp;
  }

  let big_len = str1.length;
  let small_len = str2.length;

  let result = Array(big_len + 1);
  let carry = 0;

  for (let j = 0; j < small_len; j++) {
    let sum = parseInt(str1[big_len - j - 1]) + parseInt(str2[small_len - j - 1]) + carry;
    if (sum >= 2) {
      carry = 1;
      sum -= 2;
    } else {
      carry = 0;
    }
    result[big_len - j] = sum;
  }

  for (let i = small_len; i < big_len; i++) {
    let sum = parseInt(str1[big_len - i - 1]) + carry;
    if (sum >= 2) {
      carry = 1;
      sum -= 2;
    } else {
      carry = 0;
    }
    result[big_len - i] = sum;
  }

  result[0] = carry;
  if(carry === 0){
    result = result.slice(1);
  }

  return result.join(''); // Convert the result array to a string
}

// 下面是书上的方法。这是处理两个长度不等长字符串方法以及数字字符转数字的范式，值得学习！
function addBinary1(strA, strB){
  let i = strA.length - 1 ;
  let j = strB.length - 1;
  let result = Array();
  let carry = 0;
  while(i>=0 || j>=0){
    // 只要A、B任何一个没遍历完，则不停；
    // 在循环里面再加个判断，来处理已经遍历完和未遍历完的不同情况。
    let digitA = i>=0 ? strA[i--] - '0' : 0;
    let digitB = j>=0 ? strB[j--] - '0' : 0;
    let sum = digitA + digitB + carry;
    carry = sum >= 2 ? 1 : 0;
    sum = sum >= 2 ? sum -2 : sum;
    result.push(sum);
  }
  if(carry===1) result.push(1);
  return result.reverse().join('');
}

/*============================== Question 3 ============================
题目：输入一个非负数n，请计算0到n之间每个数字的二进制形式中1的个数，并输出一个数组。例如，输入的n为4，由于0、1、2、3、4的二进制形式中1的个数分别为0、1、1、2、1，因此输出数组[0，1，1，2，1]。
 */
// 方法1：利用i&(i-1)去掉i最靠右的1，直到i变成全0.
function countBits1(n){
  // 这里必须要初始化化数组，否则数组值为undefined，进行++操作会有问题。
  let result = Array(n).fill(0);
  for(let i=1; i<=n; i++){
    let j = i;
    while(j!==0){
      j = j & (j-1);
      result[i-1]++;
    }
  }
  return result;
}

// 方法2：利用i&(i-1)去掉i最靠右的1 => 也说明bits1 of i = bits1( i&(i-1)) + 1
function countBits2(n){
  let result = Array(n+1).fill(0);
  for(let i=1; i<=n; i++){
    result[i] = result[i & (i-1)] + 1;
  }
  return result.slice(1);
}

// 方法3：观察右移。对于偶数，最右一位为0，右移一位（除于2）不影响1的数量；奇数右移则少一个1。
function countBits3(n){
  let result = Array(n+1).fill(0);
  for(let i=1; i<=n; i++){
    // 位运算的优先级很低，这个地方去掉括号直接错误。
    // 进行位运算1不再是1，而是...0000000001.
    result[i] = result[i>>1] + ( i&1 );
  }
  return result.slice(1);
}

function test_countBits(func, n){
  let result = func(n);
  console.log(result);
}

/*============================== Question 4 ============================
题目：输入一个整数数组，数组中只有一个数字出现了一次，而其他数字都出现了3次。请找出那个只出现一次的数字。例如，如果输入的数组为[0，1，0，1，0，1，100]，则只出现一次的数字是100。
 */
function getSingular(int32arr){
  let bitSums = Array(32).fill(0)
  for(let num of int32arr){
    for(let i=0; i<32; i++){
      bitSums[i] += (( num >> (31-i) ) & 1);
    }
  }
  let result = 0;
  for(let i=0; i<32; i++){
    result = ( result<<1 ) | (bitSums[i] % 3); //这里给出了从bits数组到数值的最佳范式
  }
  return result;
}

/*============================== Question 5 ============================
题目：输入一个字符串数组words，请计算不包含相同字符的两个字符串words[i]和words[j]的长度乘积的最大值。如果所有字符串都包含至少一个相同字符，那么返回0。假设字符串中只包含英文小写字母。例如，输入的字符串数组words为["abcw"，"foo"，"bar"，"fxyz"，"abcdef"]，数组中的字符串"bar"与"foo"没有相同的字符，它们长度的乘积为9。"abcw"与"fxyz"也没有相同的字符，它们长度的乘积为16，这是该数组不包含相同字符的一对字符串的长度乘积的最大值。
 */
// 第一步，给每个字符串建立字母出现索引。

function maskArray(strArray){
  const n = strArray.length;
  let masks = Array(n).fill(0)
  for(let i=0; i<n; i++){
    masks[i] = charIndexTable(strArray[i]);
  }
  return masks;
}

function charIndexTable(str){
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let index = 0;
  let intForIndexArray = 0;
  for(let char of alphabet){
    if(str.includes(char)){
      // In JavaScript, you can't directly subtract characters like char - 'a' to get the numerical position of a character in the alphabet because characters are represented as Unicode code points. 'a' and 'b' are not treated as numbers in this context. Instead, you need to use the charCodeAt method to get the numeric code point value of the characters and then perform the subtraction.
      // '7'-'0' === 7 ok!( implicitly converts numeric characters to their numerical values)
      // But 'a'-'0'=NaN!
      intForIndexArray = intForIndexArray | (1 << (char.charCodeAt(0) - 'a'.charCodeAt(0)));
    }
  }
  return intForIndexArray;
}

// 第二步，根据masks求长度乘积
function getMaxMul(strArray){
  let masks = maskArray(strArray)
  let result = 0;
  let len = masks.length;
  for(let i=0; i<len; i++){
    for(let j=i+1; j<len;j++){
      if( (masks[i] & masks[j]) === 0 ){
        let mul = strArray[i].length * strArray[j].length
        result = result >= mul ? result : mul;
      }
    }
  }
  return result;
}

/*============================== Question 6 ==============================
题目：输入一个递增排序的数组和一个值k，请问如何在数组中找出两个和为k的数字并返回它们的下标？假设数组中存在且只存在一对符合条件的数字，同时一个数字不能使用两次。例如，输入数组[1，2，4，6，10]，k的值为8，数组中的数字2与6的和为8，它们的下标分别为1与3。
 */

// 方法1：（空间换时间）使用单指针遍历数组，并把已经遍历的数值和下标存入一个字典，后续的遍历数值均在该字典中查询相加之和是否匹配（其实就是看看sum-当前数值的差是否在字典中）。由于题目要求返回的是下标，字典的结构可以是：数值为键：下标为值。
function findTargetPairIndex(arr, sum){
  let dic = {};
  for(let index=0; index<arr.length; index++){
    let diff = sum - arr[index];
    // check if a key exists in an object using the hasOwnProperty method.
    if(dic.hasOwnProperty(diff)){
      return [dic[diff], index];
    }else{
      dic[arr[index]] = index;
    }
  }
}

// 方法2：双指针（其实就是双下标）。一个指向数组始端，一个指向数组终端。
function findTargetPairIndex1(arr, sum){
  let begIndex = 0;
  let endIndex = arr.length-1;
  while( (arr[begIndex] + arr[endIndex] !== sum) && (begIndex < endIndex)) {
    if( arr[begIndex] + arr[endIndex] < sum ){
      begIndex++;
    }else{
      endIndex--;
    }
  }
  return [begIndex, endIndex]
}


/*============================== Question 7 ==============================
题目：输入一个数组，如何找出数组中所有和为0的3个数字的三元组？需要注意的是，返回值中不得包含重复的三元组。例如，在数组[-1，0，1，2，-1，-4]中有两个三元组的和为0，它们分别是[-1，0，1]和[-1，-1，2]。
 */




/* =================================== Test ===============================*/
console.log(findTargetPairIndex1([1,2,4,6,10,8,9], 14))

