function callcc(f) {
    let kont = new Continuation();
    return f(kont);
}



function make_coroutine(aResumer) {
    let firstTime = true;
    let saved_continuation = new Continuation();

    function resume(nom_corutina, value) {
        
        saved_continuation = new Continuation(value);

        callcc(nom_corutina(value))

        
        return value;
    }

    function retFunction(value) {
        if (firstTime) {
            firstTime = false;
            aResumer(resume);
        } else {
            saved_continuation(value);
        }
    }

    return (retFunction)
}

function exemple_senzill() {
    let a = make_coroutine( function(resume, value) {
    print("Ara estem a la corutina 'A'");
    print("Venim de", resume(b,'A'));
    print("Tornem a 'A'");
    print("Venim de", resume(c,'A'));
    });
    let b = make_coroutine( function(resume, value) {
    print("    Ara estem a la corutina 'B'");
    print("    Venim de", resume(c,'B'));
    print("    Tornem a 'B'");
    print("    Venim de", resume(a,'B'));
    });
    let c = make_coroutine( function(resume, value) {
    print("        Ara estem a la corutina 'C'");
    print("        Venim de", resume(a,'C'));
    print("        Tornem a 'C'");
    print("        Venim de", resume(b,'C'));
    });
    // amb aquest codi evitem "complicar-nos la vida" amb
    // problemes d'acabament quan cridem la corutina inicial
    if (typeof(a) === 'function') {
    a('*') // el valor '*' que passem a 'a' és irrellevant
    }
}

exemple_senzill()


