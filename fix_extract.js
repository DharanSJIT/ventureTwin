const testStr = "```json\n { \"a\": 1 } \n```";
console.log(testStr.replace(/```json/g, '').replace(/```/g, '').trim());
