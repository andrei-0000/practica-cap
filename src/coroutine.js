function callcc(f) {
    let kont = new Continuation();
    return f(kont);
}

function resume(where, value) {


}


function make_coroutine(aResumer) {

    let firstTime = true;
    let savedContinuation = nil;


    var resumer = aResumer

    return nil
}





