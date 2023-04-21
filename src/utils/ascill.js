export function encrypt(text,k){
    let result = "";
    for(let i=0;i<text.length;i++){
    result += String.fromCharCode(text.charCodeAt(i) + k);
    }
    return result;
    }


export function decrypt(text,k){
let result = "";
for(let i=0;i<text.length;i++){
result += String.fromCharCode(text.charCodeAt(i) - k);
}
return result;
}