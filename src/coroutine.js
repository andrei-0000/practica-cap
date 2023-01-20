// ===================== apartat a) =====================

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

// ----------------------- exemple -----------------------


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

// ----------------------- tests extra -----------------------


function daily_routine() {
  let agenda = make_coroutine(function (resume, value) {
      print("Time to start the day!");
      print("Just ", resume(brush_teeth, 'agenda'));
      print("on to the next thing!");
      print("Just ", resume(had_breakfast, 'agenda'));
      print("on to the next thing!");
      print("Just ", resume(dress_up, 'agenda'));
      print("on to the next thing!");
      print("Just ", resume(go_to_uni, 'agenda'));
      print("on to the next thing!");
      print("Just ", resume(come_back, 'agenda'));
      print("on to the next thing!");
      print("Just ", resume(chill, 'agenda'));
  });
  let brush_teeth = make_coroutine(function (resume, value) {
      print(resume(agenda, 'brushed my teeth.'));
  });
  let had_breakfast = make_coroutine(function (resume, value) {
      print(resume(agenda, 'had breakfast.'));
  });
  let dress_up = make_coroutine(function (resume, value) {
    print(resume(agenda, 'dressed up.'));
  });
  let go_to_uni = make_coroutine(function (resume, value) {
    print(resume(agenda, 'went to University.'));
  });
  let come_back = make_coroutine(function (resume, value) {
    print(resume(agenda, 'came back home.'));
  });
  let chill = make_coroutine(function (resume, value) {
    print(resume(agenda, 'finished my day!.'));
  });
  if (typeof (agenda) === 'function') {
      agenda('*')
  }
}

//daily_routine();

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
    if (typeof (tick) === 'function') {
        tick('')
    }
}

//tick_tock();


// ===================== apartat b) =====================

let a1 = [[[[1], []], [[2], [[3], [4]]]], [[[], [5]], [[6], [7]]]]
let a2 = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], []]]]
let a3 = [[[[1], [2]], [[3], [4]]], [[[5], [9]], [[7], []]]]
let a4 = [[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], [8]]]]

let a5 = [[[[[1], []], [[2], [[3], [4]]]], [[[], [5]], [[6], [7]]]], [[[[1], [2]], [[3], [4]]], [[[5], [9]], [[7], []]]]]
let a6 = [[[[[1], [2]], [[3], [4]]], [[[5], [6]], [[7], []]]],[[[[1], [2]], [[3], [4]]], [[[5], [9]], [[7], []]]]]
let a7 = [1]
let a8 = [1]
let a9 = []
let a10 = []

function is_leaf(tree) {
    if (tree.length > 1) {
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
            if (is_leaf(tree)) {
                tmp1 = tree[0];
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
            if (is_leaf(tree)) {
                tmp2 = tree[0];
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

// ----------------------- exemple -----------------------

//print(same_fringe(a1,a2)) // true
//print(same_fringe(a1,a4)) // false
//print(same_fringe(a4,a2)) // false
//print(same_fringe(a3, a4)) // false


// ----------------------- tests extra -----------------------

//print(same_fringe(a2,a3)) // false
//print (same_fringe(a5, a6)) //true
//print (same_fringe(a7, a8)) //true
//print (same_fringe(a9, a10)) //true

