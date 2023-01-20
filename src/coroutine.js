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
    let a = make_coroutine(function (resume, value) {
        print("Ara estem a la corutina 'A'");
        print("Venim de", resume(b, 'A'));
        print("Tornem a 'A'");
        print("Venim de", resume(c, 'A'));
    });
    let b = make_coroutine(function (resume, value) {
        print("    Ara estem a la corutina 'B'");
        print("    Venim de", resume(c, 'B'));
        print("    Tornem a 'B'");
        print("    Venim de", resume(a, 'B'));
    });
    let c = make_coroutine(function (resume, value) {
        print("        Ara estem a la corutina 'C'");
        print("        Venim de", resume(a, 'C'));
        print("        Tornem a 'C'");
        print("        Venim de", resume(b, 'C'));
    });
    // amb aquest codi evitem "complicar-nos la vida" amb
    // problemes d'acabament quan cridem la corutina inicial
    if (typeof (a) === 'function') {
        a('*') // el valor '*' que passem a 'a' és irrellevant
    }
}

//exemple_senzill()


function tick_tock() {
    var seconds = 0;
    let tick = make_coroutine(function (resume, value) {
        print("'Tick ready!'");
        print(resume(tock, seconds += 1), " seconds have passed")
        print("'Tick!'");
        print(resume(tock, seconds += 1), " seconds have passed")
        print("'Tick!'");
        print(resume(tock, seconds += 1), " seconds have passed")
        print("'Tick!'");
        print(resume(tock, seconds += 1), " seconds have passed")

    });
    let tock = make_coroutine(function (resume, value) {
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
    if (typeof (tick) === 'function') {
        tick('') // el valor '' que passem a 'a' és irrellevant
    }
}

//   tick_tock();


let a1 = [[[[1], []], [[2], [[3], [4]]]], [[[], [5]], [[6], [7]]]]
let a2 = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], []]]]
let a3 = [[[[1], [2]], [[3], [4]]], [[[5], [9]], [[7], []]]]
let a4 = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]]

function is_leaf(tree) {
    if (tree.length > 1) {
        //print("is not leaf")
        return false;
    }
    return true;
}

function same_fringe(tree1, tree2) {

    let tmp1 = 0;
    let lasttmp1 = 0;
    let tmp2 = 0;

    let areSame = true;
    let tree1Ended = false;
    let tree2Ended = false;

    let tree_coroutine1 = make_coroutine(function (resume, tree) {
        function navigateTree(tree) {
            //print('reached tree1')
            if (is_leaf(tree)) {
                tmp1 = tree[0];
                //print('tree1 leaf val: ', tmp1)
                resume(tree_coroutine2, tree2)
            }
            if (tree[0] != undefined && tree[0].length > 0) navigateTree(tree[0]);
            if (tree[1] != undefined && tree[1].length > 0) navigateTree(tree[1]);
        }
        if (!tree1Ended && areSame) {
            navigateTree(tree);
            tree1Ended = true;
            if (!tree2Ended)
                resume(tree_coroutine2, tree2)
        }
    })

    let tree_coroutine2 = make_coroutine(function (resume, tree) {
        function navigateTree(tree) {
            //print('reached tree2')
            if (is_leaf(tree)) {
                tmp2 = tree[0];
                //print('tree2 leaf val: ', tmp2)
                if (tmp1 == tmp2 && !tree1Ended) {
                    lasttmp1 = tmp1;
                    resume(tree_coroutine1, tree1);
                }
                else {
                    areSame = false
                }
            }
            if (tree[0] != undefined && tree[0].length > 0 && areSame) navigateTree(tree[0]);
            if (tree[1] != undefined && tree[1].length > 0 && areSame) navigateTree(tree[1]);
        }
        if (!tree2Ended && areSame) {
            navigateTree(tree);
            //print('acaba arbre 2')
            tree2Ended = true;
            if (tmp1 != lasttmp1 && !tree1Ended)
                areSame = false;
            resume(tree_coroutine1, tree)
        }
        resume(tree_coroutine1, tree)
    })

    if (typeof (tree_coroutine1) === 'function') {
        tree_coroutine1(tree1)
    }
    return areSame;
}

print(same_fringe(a1,a2)) // true
print(same_fringe(a1,a4)) // false
print(same_fringe(a4,a2)) // false
print(same_fringe(a3, a4)) // false

print(same_fringe(a2,a3)) // false


