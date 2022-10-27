
const MH = require('./MinHash.js');

test('Sha1', () => {
    expect(MH.MinHash.sha1('minhash')).toBe(442221856n);
});

test('Identical permutations', () => {

    m1 = new MH.MinHash()
    m2 = new MH.MinHash()
    expect(m1.permutations).toBe(m2.permutations);

    m3 = new MH.MinHash(num_perm = 256)
    m4 = new MH.MinHash(num_perm = 256)
    expect(m3.permutations).toBe(m4.permutations);
});

test('Init Hash Values', () => {

    m1 = new MH.MinHash()
    m2 = new MH.MinHash()

    expect(m1.hashvalues).toStrictEqual(m2.hashvalues);

    m3 = new MH.MinHash(num_perm = 256)
    m4 = new MH.MinHash(num_perm = 256)
    expect(m3.hashvalues).toStrictEqual(m4.hashvalues);
});

test('Hash Values after same update', () => {


    m1 = new MH.MinHash()
    m2 = new MH.MinHash()

    m1.update('test')
    m2.update('test')

    expect(m1.hashvalues).toStrictEqual(m2.hashvalues);

    m3 = new MH.MinHash(num_perm = 256)
    m4 = new MH.MinHash(num_perm = 256)

    m3.update('test')
    m4.update('test')

    expect(m3.hashvalues).toStrictEqual(m4.hashvalues);
});

test('Hash Values after same several update', () => {

    data1 = ['minhash', 'is', 'a',  'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between']

    data2 = ['minhash', 'is', 'a',  'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between']


    m1 = new MH.MinHash()
    data1.forEach((d, i) => m1.update(d));

    m2 = new MH.MinHash()
    data2.forEach((d, i) => m2.update(d));

    expect(m1.hashvalues).toStrictEqual(m2.hashvalues);

    m3 = new MH.MinHash(num_perm = 256)
    m4 = new MH.MinHash(num_perm = 256)

    data1.forEach((d, i) => m3.update(d));
    data2.forEach((d, i) => m4.update(d));


    expect(m3.hashvalues).toStrictEqual(m4.hashvalues);
});

test('Jaccard Different', () => {

    data1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets']

    data2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents']


    m1 = new MH.MinHash()
    data1.forEach((d, i) => m1.update(d));

    m2 = new MH.MinHash()
    data2.forEach((d, i) => m2.update(d));


    s1 = new Set(data1)
    s2 = new Set(data2)
    const union = new Set([...s1, ...s2]);
    const intersection = new Set(
        Array.from(s1).filter(x => s2.has(x))
    );

    actual_jaccard = intersection.size / union.size

    expect(m1.jaccard(m2)).toBe(actual_jaccard);


});

test('Jaccard Equal', () => {

    data1 = ['minhash', 'is', 'a',  'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between']

    data2 = ['minhash', 'is', 'a',  'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between']


    m1 = new MH.MinHash()
    data1.forEach((d, i) => m1.update(d));

    m2 = new MH.MinHash()
    data2.forEach((d, i) => m2.update(d));


    s1 = new Set(data1)
    s2 = new Set(data2)
    const union = new Set([...s1, ...s2]);
    const intersection = new Set(
        Array.from(s1).filter(x => s2.has(x))
    );

    actual_jaccard = intersection.size / union.size

    expect(m1.jaccard(m2)).toBe(actual_jaccard);


});