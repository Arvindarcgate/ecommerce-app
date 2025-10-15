
function isValid(s) {
  const stack = [];
  const map = {
    "(": ")",
    "{": "}",
    "[": "]"
  };

  for (let char of s) {
    if (map[char]) {
      // If it's an opening bracket, push expected closing bracket
      stack.push(map[char]);
    } else {
      // If it's a closing bracket, check if it matches the last one
      if (stack.pop() !== char) {
        return false;
      }
    }
  }

  

  return stack.length === 0; // stack should be empty if valid
}

// Test
console.log(isValid("()"));      // true
console.log(isValid("()[]{}"));  
console.log(isValid("(]"));      // false
console.log(isValid("([)]"));    // false
console.log(isValid("{[]}"));    //

