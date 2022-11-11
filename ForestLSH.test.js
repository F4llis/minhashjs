
const F = require('./ForestLSH.js');
const MH = require("./MinHash");
const data = require("./test.accuraccy.json");

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
}


test('Init Forest', () => {
    var forest = new F.MinHashLSHForest()

    var forest2 = new F.MinHashLSHForest(num_perm=128, l=20)

    var forest2 = new F.MinHashLSHForest(num_perm=256, l=8)

});

test('Build Forest', () => {

    var data1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets']
    var data2 = ['minhash', 'dog', 'data', 'structure', 'for',
        'fork', 'twice', 'similarity', 'food', 'money']
    var data3 = ['minhash', 'is', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents']

    // Create MinHash objects
    var m1 = new MH.MinHash(num_perm=128)
    var m2 = new MH.MinHash(num_perm=128)
    var m3 = new MH.MinHash(num_perm=128)


    data1.forEach((d, i) => m1.update(d));
    data2.forEach((d, i) => m2.update(d));
    data3.forEach((d, i) => m3.update(d));


    // Create a MinHash LSH Forest with the same num_perm parameter
    var forest = new F.MinHashLSHForest(num_perm=128)

    // Add m2 and m3 into the index
    forest.add("m2", m2)
    forest.add("m3", m3)

    //IMPORTANT: must call index() otherwise the keys won't be searchable
    forest.index()

    // Check for membership using the key
    expect(forest.keys.has("m2")).toBeTruthy();
    expect(forest.keys.has("m3")).toBeTruthy();


    // Using m1 as the query, retrieve top 2 keys that have the higest Jaccard
    forest.query(m1, 1)

});

test('Query item already inside forest', () => {

    const data = require('./test.accuraccy.json');
    const repo = {}


    var forest = new F.MinHashLSHForest(num_perm=128)

    cpt=0
    for (var i = 0; i < data.datum.length; i++){

        data1 = data.datum[i][0]
        data2 = data.datum[i][1]

        m1 = new MH.MinHash()
        data1.forEach((d, i) => m1.update(d));

        m2 = new MH.MinHash()
        data2.forEach((d, i) => m2.update(d));

        forest.add("m" + cpt, m1)
        repo["m" + cpt] = [data1,m1]
        cpt += 1

        forest.add("m" + cpt, m2)
        repo["m" + cpt] = [data2, m2]
        cpt += 1

    }

    forest.index()

    mx = new MH.MinHash()
    var daty =  repo["m10"][0]
    daty.forEach((d, i) => mx.update(d));



    var r  = forest.query(mx, 2)

    expect(r.includes('m10')).toBeTruthy();

})

test('Query accuracy of custom query', () => {

    const data = require('./test.accuraccy.json');
    const repo = {}


    var forest = new F.MinHashLSHForest(num_perm=128)

    cpt=0
    for (var i = 0; i < data.datum.length; i++){

        data1 = data.datum[i][0]
        data2 = data.datum[i][1]

        m1 = new MH.MinHash()
        data1.forEach((d, i) => m1.update(d));

        m2 = new MH.MinHash()
        data2.forEach((d, i) => m2.update(d));

        forest.add("m" + cpt, m1)
        repo["m" + cpt] = [data1,m1]
        cpt += 1

        forest.add("m" + cpt, m2)
        repo["m" + cpt] = [data2, m2]
        cpt += 1

    }
    forest.index()

    mx = new MH.MinHash()


    var keys = getMultipleRandom(Object.keys(repo), 2)

    var first = repo[keys[0]]
    var second = repo[keys[1]]

    var half = Math.ceil(first[0].length / 2);


    var first_half = first[0].splice(0, half)
    var second_half = second[0].splice(-half)

    var daty = first_half.concat(second_half)

    daty.forEach((d, i) => mx.update(d));

    var r = forest.query(mx, 10)

    expect(r.includes(keys[0])).toBeTruthy();
    expect(r.includes(keys[1])).toBeTruthy();


})
