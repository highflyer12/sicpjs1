### Questions to be answered
1. how to handle that a function can return a value type and also some times return null?
2. how to define type that can be null?

### takeaways
1. To define an object type, we simply list its properties and their types, as {head: any; tail: any;}.
Type Aliases
```ts
type List = {
    head: any;
    tail: any;
}
```
2. Optional Properties Object types can also specify that some or all of their properties are optional. To do this, **add a ? after the property name**.

```js
function printName(obj: { first: string; last?: string }) {
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```
>access a property that doesn’t exist will get the value undefined rather than a runtime error. when read from an optional property, first need to check for undefined before using it.
> if (obj.last !== undefined)
3. **Union Types**. e.g. function printId(id: number | string). But, TypeScript will **only allow operations** that are valid for **every member** of the union. (a union of types appears to have the **intersection** of those types’ properties). e.g.
```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
```
>Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'. 

Solution: use **typeof** or **Array.isArray** to narrow.
```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
function welcomePeople(x: string[] | string) {
    if (Array.isArray(x)) {
        console.log("Hello, " + x.join(" and "));
    } else {
        console.log("Welcome lone traveler " + x);
    }
}
```
4. Type Assertions: use a type assertion **to specify a more specific type**
```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```
5. Literal Types: **combining literals into unions**, you can express a much more useful concept - for example, functions that only accept a certain set of known values
```ts
function printText(s: string, alignment: "left" | "right" | "center") {
}
```
6. **Literal Inference**
```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```
上面这段代码req对象的“method”赋值为“GET”，会被Literal Inference成string；但是handleRequest的method类型为"GET" | "POST"，不是string类型，所以handleRequest(req.url, req.method)会报错。
解决方法：关闭Literal Inference
```ts
const req = { url: "https://example.com", method: "GET" as "GET" };
handleRequest(req.url, req.method as "GET");
// or:
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```
7. Non-null Assertion Operator (Postfix!)
> removing null and undefined from a type **without doing any explicit checking**. Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined