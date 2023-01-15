function expressio_qualsevol_amb_continuacions() {
    let k = new Continuation();
    print("pas 1 ");
    let x = (2 + k(3 * 5));
    print("pas 2 ");
    let y = (4 - 3 * 3);
    return x*y
   }

expressio_qualsevol_amb_continuacions()
