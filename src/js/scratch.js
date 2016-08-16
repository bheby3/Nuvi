/**
 * Created by brandonhebbert on 8/15/16.
 */
function displayIndividualActorsData() {
  var data = datasetWithUpdatedDate;
  var format = d3.time.format("%Y-%m-%d-%H-%M-%S");

  var myMouseoverFunction = function () {
    var circle = d3.select(this);
    circle.attr('stroke', function () {
      return "white";
    })
  };
  var handleMouseOut = function () {
    var circle = d3.select(this);
    circle.attr('stroke', function () {
      return "black";
    })
  };

  var setActivityLikesFn = function (d) {
    return d.activity_likes
  };
  var setDateFn = function (d) {
    return format.parse(d.activity_date)
  };
  var setActivitySharesFn = function (d) {
    if (d.activity_shares <= 4) {
      return d.activity_shares + 5
    } else {
      return (d.activity_shares * .35 + 3)
    }
  };
  var setIdFn = function (d) {
    return d.id
  };
  var setColorFn = function (d) {
    d = d.activity_sentiment == 0 ? "#1CC222" : d.activity_sentiment == 1 ? "#CA2F2B" : "#35465C";
    return d;
  };
  var x = d3.time.scale()
    .range([30, 280])
    .domain(d3.extent(data, setDateFn));
  var y = d3.scale.linear()
    .range([1380, 70])
    .domain(d3.extent(data, setActivityLikesFn));
  var svg = d3.select("#mention_timeline").append("svg:svg")
    .attr("width", "100%")
    .attr("height", 300)
    .style("background", "none");
  svg.selectAll("circle").data(data).enter()
    .append("svg:circle")
    .style("fill", function (d) {
      return setColorFn(d)
    })
    .attr("id", function (d) {
      return setIdFn(d)
    })
    .attr("stroke", function () {
      return "black"
    })
    .attr("stroke-width", function () {
      return 1
    })
    .attr("r", function (d) {
      return setActivitySharesFn(d)
    })
    .attr("cx", function (d) {
      return y(setActivityLikesFn(d));
    })
    .attr("cy", function (d) {
      return x(setDateFn(d))
    })
    .style("display", "block")
    .style("cursor", "pointer")
    .on("mouseover", myMouseoverFunction)
    .on("mouseout", handleMouseOut)
    .on("click", function (d) {
      setModalFn(d);
    })
}

function horizontalCirclePacking() {

  var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
  // padding between nodes
    padding = 2,
    maxRadius = 700,
    numberOfNodes = 50;

  // Create random node data.
  var data = d3.range(numberOfNodes).map(function () {
    var value = Math.floor(Math.random() * 50) / 10,
      size = Math.floor(Math.sqrt((value + 1) / numberOfNodes * -Math.log(Math.random())) * maxRadius * 10),
      datum = {value: value, size: size};
    return datum;
  });



  var x = d3.scale.linear()
    .domain([0, 5])
    .range([margin.left, width + margin.right]);

  // Map the basic node data to d3-friendly format.
  var nodes = data.map(function (node, index) {
    return {
      idealradius: node.size / 100,
      radius: 0,
      // Give each node a random color.
      color: '#ff7f0e',
      // Set the node's gravitational centerpoint.
      idealcx: x(node.value),
      idealcy: height / 2,
      x: x(node.value),
      // Add some randomization to the placement;
      // nodes stacked on the same point can produce NaN errors.
      y: height / 2 + Math.random()
    };
  });

  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

  var xAxis = d3.svg.axis()
    .scale(x);

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var loading = svg.append("text")
    .attr("x", ( width + margin.left + margin.right ) / 2)
    .attr("y", ( height + margin.top + margin.bottom ) / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…");

  /**
   * On a tick, apply custom gravity, collision detection, and node placement.
   */
  function tick(e) {
    for (let i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      /*
       * Animate the radius via the tick.
       *
       * Typically this would be performed as a transition on the SVG element itself,
       * but since this is a static force layout, we must perform it on the node.
       */
      node.radius = node.idealradius - node.idealradius * e.alpha * 10;
      node = gravity(.2 * e.alpha)(node);
      node = collide(.5)(node);
      node.cx = node.x;
      node.cy = node.y;
    }
  }

  /**
   * On a tick, move the node towards its desired position,
   * with a preference for accuracy of the node's x-axis placement
   * over smoothness of the clustering, which would produce inaccurate data presentation.
   */
  function gravity(alpha) {
    return function (d) {
      d.y += (d.idealcy - d.y) * alpha;
      d.x += (d.idealcx - d.x) * alpha * 3;
      return d;
    };
  }

  /**
   * On a tick, resolve collisions between nodes.
   */
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
      return d;
    };
  }

  /**
   * Run the force layout to compute where each node should be placed,
   * then replace the loading text with the graph.
   */
  function renderGraph() {
    // Run the layout a fixed number of times.
    // The ideal number of times scales with graph complexity.
    // Of course, don't run too long—you'll hang the page!
    force.start();
    for (var i = 100; i > 0; --i) force.tick();
    force.stop();

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + ( margin.top + ( height * 3 / 4 ) ) + ")")
      .call(xAxis);

    var circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .style("fill", function (d) {
        return d.color;
      })
      .attr("cx", function (d) {
        return d.x
      })
      .attr("cy", function (d) {
        return d.y
      })
      .attr("r", function (d) {
        return d.radius
      });

    loading.remove();
  }

  // Use a timeout to allow the rest of the page to load first.
  setTimeout(renderGraph, 10);


}

function createActorGraph() {
//click option - toggle display for actorGraph[i]
  for (let i = 0; i < days.length; i++) {
    let i = i.toString();
    let actorSelectOption = document.createElement('option');
    actorSelectOption.innerHTML = `${totalDaysInDataset[i]}`;
    actorSelectOption.value = `actorGraph${i}`;
    /*actorSelectOption.addEventListener('click', function(e) {
     console.log('clicked');
     var element = document.getElementById(`${e.value}`);
     element.classList.remove('visible')
     });*/
    actorSelectMenu.appendChild(actorSelectOption);
    /*actorSelectMenu.onchange = function(e) {

     }*/
    let newDiv = document.createElement(`div`);
    newDiv.classList.add('flex_row_center');
    let content = document.createTextNode(`${totalDaysInDataset[i]}`);
    newDiv.id = `actorGraph${i}`;
    actorGraph.appendChild(content);
    actorGraph.appendChild(newDiv);
    horizontalCirclePacking(days[i], newDiv, i)
  }

}

function horizontalCirclePacking(day, element, i) {


  /*let newDiv = document.createElement('div');
   let content = document.
   function addActorGraph() {
   for (let i = 0; i < days.length; i++) {
   let newDiv = document.createElement('div');
   let content = document.createTextNode(days[i] + `: ${dayCounterArray[i]}`);
   actorGraph.appendChild(content);
   divToInsertOn.appendChild(newDiv).className = "flex_row_center";
   }
   }

   console.log("days", days);
   */
  var setDateFn = function (d) {
    return format.parse(d.activity_date)
  };
  var myMouseoverFunction = function () {
    var circle = d3.select(this);
    circle.attr('stroke', function () {
      return "white";
    })
  };
  var handleMouseOut = function () {
    var circle = d3.select(this);
    circle.attr('stroke', function () {
      return "black";
    })
  };
  var setActivitySharesFn = function (d) {
    if (d.idealradius <= 4) {
      return d.idealradius + 20 * .35
    } else {
      return (d.idealradius * .35)
    }
  };

  // var data = datasetWithUpdatedDate;
  var data = day;

  var format = d3.time.format("%Y-%m-%d-%H-%M-%S");

  console.log('actorsDividedByDate: ', actorsDividedByDay);

  var margin = {top: 0, right: 0, bottom: 10, left: 0},
    width = 1260 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
  // padding between nodes
    padding = .5,
    maxRadius = 100;

  // {value: d.activity_date, size: d.activity_shares}
  console.log('data: ', data);
  // Create random node data.
  /*var data = d3.range(numberOfNodes).map(function () {
   var value = Math.floor(Math.random() * 50) / 10,
   size = Math.floor(Math.sqrt((value + 1) / numberOfNodes * -Math.log(Math.random())) * maxRadius * 10),
   datum = {value: value, size: size};
   return datum;
   });*/

  var x = d3.time.scale()
    .range([40, 1080])
    .domain(d3.extent(data, setDateFn));

  /* var x = d3.scale.linear()
   .domain([0, 5])
   .range([margin.left, width + margin.right]);
   */

  // Map the basic node data to d3-friendly format.
  var nodes = data.map(function (node, index) {
    return {
      // idealradius: node.size / 100,
      idealradius: node.activity_shares,
      radius: 0,
      /*radius: (function () {
       var d = node;
       if (d.activity_shares <= 4) {
       return d.activity_shares + 5
       } else {
       return d
       }
       }),*/
      modalData: node,
      // Give each node a random color.
      color: (function () {
        var d = node.activity_sentiment == 0 ? "#0F4651" : node.activity_sentiment == 1 ? "#1CC222" : "#CA2F2B";
        // var d = node.activity_sentiment == 0 ? "#1CC222" : node.activity_sentiment == 1 ? "#CA2F2B" : "#35465C";
        return d;
      }()),
      // Set the node's gravitational centerpoint.
      idealcx: x(setDateFn(node)),
      idealcy: height / 2,
      x: x(setDateFn(node)),
      // Add some randomization to the placement;
      // nodes stacked on the same point can produce NaN errors.
      y: height / 3 + Math.random()
    };
  });

  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(14);

  /*
   var xAxis = d3.svg.axis()
   .scale(x);
   */

  // var svg = d3.select("body").append("svg")
  // var svg = d3.select("#mentions_by_day1").append("svg")
  var svg = d3.select(`#actorGraph${i}`).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var loading = svg.append("text")
    .attr("x", ( width + margin.left + margin.right ) / 2)
    .attr("y", ( height + margin.top + margin.bottom ) / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…");

  /**
   * On a tick, apply custom gravity, collision detection, and node placement.
   */
  function tick(e) {
    for (let i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      /*
       * Animate the radius via the tick.
       *
       * Typically this would be performed as a transition on the SVG element itself,
       * but since this is a static force layout, we must perform it on the node.
       */
      // node.radius = node.idealradius - node.idealradius * e.alpha * 10;
      node.radius = setActivitySharesFn(node)
      node = gravity(.1 * e.alpha)(node);
      node = collide(.5)(node);
      node.cx = node.x;
      node.cy = node.y;
    }
  }

  /**
   * On a tick, move the node towards its desired position,
   * with a preference for accuracy of the node's x-axis placement
   * over smoothness of the clustering, which would produce inaccurate data presentation.
   */
  function gravity(alpha) {
    return function (d) {
      d.y += (d.idealcy - d.y) * alpha;
      d.x += (d.idealcx - d.x) * alpha * 3;
      return d;
    };
  }

  /**
   * On a tick, resolve collisions between nodes.
   */
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
      return d;
    };
  }

  /**
   * Run the force layout to compute where each node should be placed,
   * then replace the loading text with the graph.
   */
  function renderGraph() {
    // Run the layout a fixed number of times.
    // The ideal number of times scales with graph complexity.
    // Of course, don't run too long—you'll hang the page!
    force.start();
    for (var i = 50; i > 0; --i) force.tick();
    force.stop();

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + ( margin.top + ( height * 3 / 4 ) ) + ")")
      .call(xAxis);

    var circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .style("fill", function (d) {
        return d.color;
      })
      .attr("cx", function (d) {
        return d.x
      })
      .attr("cy", function (d) {
        return d.y
      })
      .attr("stroke", function () {
        return "black"
      })
      .attr("stroke-width", function () {
        return 1
      })
      /*.attr("r", function (d) {
       return d.radius
       })*/
      .attr("r", function (d) {
        return setActivitySharesFn(d)
      })

      .on("mouseover", myMouseoverFunction)
      .on("mouseout", handleMouseOut)
      .on("click", function (d) {
        setModalFn(d.modalData);
      })

    loading.remove();
  }

  // Use a timeout to allow the rest of the page to load first.
  setTimeout(renderGraph, 2);
}
