// You betta werk...
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs', 'https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');
var textCompareModel = null;
self.addEventListener('message', function(e) {
  const match = async(text1, text2) => {
    const texts = [text1, text2];
    const embeddings = await textCompareModel.embed(texts);
    const text1tf = tf.slice(embeddings, [0, 0], [1]);
    const text2tf = tf.slice(embeddings, [1, 0], [1]);
    const idx = tf.matMul(text1tf, text2tf, false, true).dataSync();
    return idx;
  }
  use.load().then(model => {   
    textCompareModel = model;
    let t1 = e.data[0];
    let t2 = e.data[1];
    match(t1, t2).then(result => {
      self.postMessage(result);
    });
  });

}, false);