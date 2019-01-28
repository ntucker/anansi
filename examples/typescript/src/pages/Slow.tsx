let P: Promise<boolean> | boolean;
function createPromise() {
  if (!P) {
    P = new Promise<boolean>((resolve, reject) => {
      console.log('promise starts');
      setTimeout(() => {
        console.log('promise done');
        resolve(true);
      }, 1500);
    }).then(v => {
      P = v;
      return v;
    });
  }
  return P;
}

export default function Slow() {
  let promise = createPromise();

  if (typeof promise !== 'boolean') {
    throw promise;
  }
  return (
    <>
      <h2>Slow page has loaded</h2>
      <p>Stuff for the slow page</p>
    </>
  );
}
