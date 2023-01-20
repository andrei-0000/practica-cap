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
    }

    function retFunction(value) {
        if (firstTime) {
            firstTime = false;
            aResumer(resume, value);
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

//exemple_senzill()


function tick_tock() {
    var seconds = 0;
    let tick = make_coroutine( function(resume, value) {
    print("'Tick ready!'");
    print(resume(tock, seconds += 1), " seconds have passed")
    print("'Tick!'");
    print(resume(tock, seconds += 1), " seconds have passed")
    print("'Tick!'");
    print(resume(tock, seconds += 1), " seconds have passed")
    print("'Tick!'");
    print(resume(tock, seconds += 1), " seconds have passed")
    
    });
    let tock = make_coroutine( function(resume, value) {
    print("'Tock ready!'");
    print(resume(tick, seconds += 1), " seconds have passed")
    print("'Tock!'");
    print(resume(tick, seconds += 1), " seconds have passed")
    print("'Tock!'");
    print(resume(tick, seconds += 1), " seconds have passed")
    print("'Tock!'");
    print(resume(tick, seconds += 1), " seconds have passed")
    });
    // amb aquest codi evitem "complicar-nos la vida" amb
    // problemes d'acabament quan cridem la corutina inicial
    if (typeof(tick) === 'function') {
    tick('') // el valor '' que passem a 'a' és irrellevant
    }
   }

//   tick_tock();


let a1 = [ [ [ [1], [] ], [ [2], [ [3], [4] ] ] ], [ [ [], [5] ], [ [6], [7] ] ] ]
let a2 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [6] ], [ [7], [] ] ] ]
let a3 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [9] ], [ [7], [] ] ] ]
let a4 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [6] ], [ [7], [8] ] ] ]

function is_leaf (tree) {
    if (tree.length > 1)
    {
        print("is not leaf")
        return false;
    }
    return true;
}

function same_fringe (tree1, tree2) {

    let tmp1;
    let tmp2;
    
    let tree_coroutine1 = make_coroutine(function(resume, tree) {
        if (is_leaf(tree)) {
            tmp1 = tree;
            resume(tree_coroutine2, tree2)
        }
        resume(tree_coroutine1, tree[0]);
        resume(tree_coroutine1, tree[1]);
    })

    let tree_coroutine2 = make_coroutine(function(resume, tree) {
        if (is_leaf(tree)){ 
            tmp2 = tree;
            if (tmp1 == tmp2)
                resume(compare_tree('*'))
            else return false;
        }
        resume(tree_coroutine2, tree[0]);
        resume(tree_coroutine2, tree[1]);
    })

    let compare_tree = make_coroutine(function(resume, value) {
        if (is_leaf(tree1))
            return true;
        resume(tree_coroutine1, tree1)
    })
    
    let val = compare_tree('*')
    return val;
}

print(same_fringe(a1,a2)) // true
print(same_fringe(a1,a4)) // false
print(same_fringe(a4,a2)) // false
print(same_fringe(a3,a4)) // false


