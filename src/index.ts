// introduce record operator
let x: Record<string, string | number | Function> = { name: 'Alice', age: 23 };

x.search = (n) => console.log(n);