//generates an array object with every single pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
.then(res => res.json()) // parse response as JSON
.then(data => {
    let arr = [];
    console.log(data);
    const dataArr = data.results;
    dataArr.forEach(x => arr.push(x.name));
    return arr;
})
.catch(err => {
    console.log(`error ${err}`);
});
