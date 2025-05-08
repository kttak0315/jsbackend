async function myName() {
    return "ANDY";
}

async function showName() {
    const name = await myName() ;
    console.log(name);
}

console.log(myName());