require('../scss/base.scss');

var DashBoardManager = (function () {

  function generateIndividualActorGraph() {
    var
      actorGraph = document.getElementById('actor_graph'),
      dateSelect = document.getElementById('date_select');

    /*selection function chooses the graph to show*/
    dateSelect.onchange = function (event) {
      let optionId = `modal${event.srcElement.value}`;
      showActorGraph(event, optionId);
      window.scrollTo(0, document.body.scrollHeight);
    };

    /*generate graph by most recent day first*/
    for (let i = days.length - 1; i >= 0; i--) {
      // /*create div for graph to append to*/
      let graph = document.createElement(`div`);
      let option = document.createElement('option');
      graph.classList.add('flex_row_center');
      graph.id = `actorGraph${i}`;
      option.value = `${i}`;
      option.innerHTML = `${totalDaysInDataset[i]}`;
      dateSelect.appendChild(option);
      actorGraph.appendChild(graph);
      individualActorGraph(days[i], i)
    }

    function showActorGraph(evt, graphId) {
      var
        actorGraphHeader = document.getElementById("actor_graph_header"),
        viewMentions = document.getElementById('view_mentions'),
        tabcontent = document.getElementsByClassName("tabcontent");

      for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      actorGraphHeader.style.display = "block";
      evt.currentTarget.className += " active";
      viewMentions.style.display = "block";
      evt.currentTarget.className += " active";
      document.getElementById(graphId).style.display = "block";
      evt.currentTarget.className += " active";
    }

    function individualActorGraph(day, i) {
      var setDateFn = function (d) {
        return format.parse(d.activity_date)
      };
      var mouseoverFunction = function () {
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
        if (d.idealradius <= 10) {
          return d.idealradius + 20 * .35
        } else {
          return (d.idealradius * .33)
        }
      };
      var setSentimentText = function (d) {
        if (d.modalData.activity_sentiment === 1) {
          return "+"
        } else if (d.modalData.activity_sentiment === -1) {
          return "-"
        }
      };

      var data = day;
      var format = d3.time.format("%Y-%m-%d-%H-%M-%S");

      var
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 1265 - margin.left - margin.right,
        height = 335 - margin.top - margin.bottom,
        padding = 0,
        maxRadius = 100;

      var x = d3.time.scale()
        .range([60, 1200])
        .domain(d3.extent(data, setDateFn));

      // Map node data to d3 format.
      var nodes = data.map(function (node) {
        return {
          idealradius: node.activity_shares,
          radius: 0,
          modalData: node,
          color: (function () {
            var d = node.activity_sentiment == 0 ? "#0F4651" : node.activity_sentiment == 1 ? "#1CC222" : "#CA2F2B";
            return d;
          }()),
          // Set the node's gravitational centerpoint.
          idealcx: x(setDateFn(node)),
          idealcy: height / 2,
          x: x(setDateFn(node)),
          // Add some randomization to the placement else NaN
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

      var svg = d3.select(`#actorGraph${i}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", `modal${i}`)
        .attr('class', 'tabcontent')
        .style('background-color', "black")
        .style('border-bottom', '1px solid #1B1B1B')
        .style('margin-bottom', '20px')
        .style('padding-bottom', '8px')
        .style('box-shadow', '0 0px 15px 5px rgba(0, 0, 0, 1)');

      var loading = svg.append("text")
        .attr("id", `modal${i}`)
        .attr('class', 'tabcontent')
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
          node.radius = setActivitySharesFn(node);
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
        force.start();
        for (var i = 45; i > 0; --i) force.tick();
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
          .attr("r", function (d) {
            return setActivitySharesFn(d)
          })
          .style("display", "block")
          .style("cursor", "pointer")
          .on("mouseover", mouseoverFunction)
          .on("mouseout", handleMouseOut)
          .on("click", function (d) {
            setIndvidualActorModalContent(d.modalData);
          });

        var text = svg.append("svg:g").selectAll("g")
          .data(force.nodes())
          .enter().append("svg:g");

        text.append("svg:text")
          .attr("text-anchor", "middle")
          .text(function (d) {
            return setSentimentText(d)
          })
          .style('fill', '#F8F8F8')
          .style('stroke', 'black')
          .style('stroke-width', '.02em')
          .style("display", "block")
          .style("cursor", "pointer")
          .on("click", function (d) {
            setIndvidualActorModalContent(d.modalData);
          });

        text.attr("transform", function (d) {
          d.y = d.y + (d.y * .02);
          return "translate(" + d.x + "," + d.y + ")";
        });
        loading.remove();
      }

      renderGraph()
    }
  }

  function generateHourlyMentionsLineGraph(data, widthOutput) {

    var hourCounter = [],
      mentionCounter,
      hourMentionCombined = [],
      datasetWithUpdatedDate = [],
      dataset;

    /*generate random hour to modify date*/
    for (let i = 0; i < data.length; i++) {
      var hours = Math.random() * (24) | 0;
      if (hours < 10) hours = "0" + hours;
      var hour = hours;
      var minutes = Math.random() * (60) | 0;
      var seconds = Math.random() * (60) | 0;
      hour = "-" + hour + "-" + minutes + "-" + seconds;
      data[i].timeHour = data[i].activity_date + "-" + hours;
      data[i].activity_date = data[i].activity_date + hour;
      data[i].hour = hours;
      datasetWithUpdatedDate.push(data[i]);
    }

    dataset = datasetWithUpdatedDate;
    
    /*generate array for line graph*/
    for (let i = 0; i < dataset.length; i++) {
      let day = dataset[i].timeHour.toString();
      if ((day) && (hourCounter.indexOf(day) === -1)) {
        hourCounter.push(day);
      }
    }
    mentionCounter = hourCounter.sort().map(x => 0);

    for (let i = 0; i < dataset.length; i++) {
      let day = dataset[i].timeHour.toString();
      if ((day) && (hourCounter.indexOf(day) !== -1)) {
        let hourToIncrement = parseInt(hourCounter.indexOf(day));
        mentionCounter[hourToIncrement]++;
      }
    }

    for (let i = 0; i < hourCounter.length; i++) {
      let hour = hourCounter[i].toString();
      let mention = mentionCounter[i];
      let obj = {"date": hour, "close": mention};
      hourMentionCombined.push(obj);
    }

    data = hourMentionCombined;


    /*window.onresize = resizeGraph();
    function resizeGraph() {
      var widthOutput = document.getElementById('mentions_per_sentiment_graph').offsetWidth;
      if (window.innerWidth < 800 && widthOutput !== 600) {
        generateHourlyMentionsLineGraph(actorsMentions, 600);
        // widthOutput = 600;
      }

      else if (window.innerWidth > 850 && widthOutput === 600) {
        generateHourlyMentionsLineGraph(actorsMentions, 850);
        // widthOutput = 800;
      }
    }*/

    var margin = {top: 13, right: 10, bottom: 25, left: 30},
      // var margin = {top: 0, right: 0, bottom: 0, left: 0},
      // width = 850 - margin.left - margin.right,
      width = widthOutput - margin.left - margin.right,
      height = 170 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d-%H").parse;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(13);

    var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

    var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.close);
      });

    var svg = d3.select("#mentions_timeline_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    function getTheData() {
      data.map(function (d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      x.domain(d3.extent(data, function (d) {
        return d.date;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.close;
      })]);

      svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    }
    getTheData();
  }

  function generateProviderBarChart() {
    var w = "410",
      h = "230",
      padding = 4;

    d3.select("#mentions_wrapper").append("svg")
      .attr("width", w)
      .attr("height", h);

    var x = d3.scale.linear()
      .domain([0, d3.max(socialMediaStats)])
      .range([5, 380]);

    d3.select("#mentions_per_provider_graph")
      .selectAll("div")
      .data(socialMediaProviderNames)
      .enter().append("div")
      .style("width", function (d) {
        return x(d.number) + "px";
      })
      .style("margin", "1em 4px 1em 6px")
      .style("padding-left", ".75em")
      .attr("id", function (d, i) {
        var result = 'social_media' + i;
        return result;
      })
      .text(function (d) {
        return d.name + ": " + d.number;
      });
  }

  function generateSentimentBarChart() {
    var
      w = "410",
      h = "230",
      padding = 4,
      social;

    social = socialMediaSentiment;

    var sentimentStats = social.map((x)=> {
      return x.number;
    });

    d3.select("#test").append("svg")
      .attr("width", w)
      .attr("height", h);

    var x = d3.scale.linear()
      .domain([0, d3.max(sentimentStats)])
      .range([5, 390]);

    d3.select("#sentiment_timeline_body")
      .selectAll("div")
      .data(social)
      .enter().append("div")
      .style("width", function (d) {
        return x(d.number) + "px";
      })
      .style("margin", ".75em 4px 1em 6px")
      .style("padding-left", ".75em")
      .attr("id", function (d, i) {
        var result = 'sentiment' + i;
        return result;
      })
      .text(function (d) {
        return d.name;
      });
  }

  function processActorsMentions(data) {

    var
      facebook = 0,
      instagram = 0,
      tumblr = 0,
      twitter = 0,

      good = 0,
      bad = 0,
      neutral = 0,
      avgMentions,
      totalActivityShares = 0,
      
      /*DOM Elements*/
      totalMentionsInPeriodDiv = document.getElementById('total_mentions_in_period'),
      totalSharedMentionsDiv = document.getElementById('total_shared_mentions'),
      totalDaysDiv = document.getElementById('total_days'),
      avgMentionsPerDay = document.getElementById('avg_mentions_day'),
      daysInPeriodDiv = document.getElementById('days_in_period');

    /*inc variables*/
    for (let i = 0; i < data.length; i++) {
      switch (data[i].provider) {
        case "twitter":
          twitter++;
          break;
        case "facebook":
          facebook++;
          break;
        case "instagram":
          instagram++;
          break;
        case "tumblr":
          tumblr++;
          break;
      }
      switch (data[i].activity_sentiment) {
        case 0:
          neutral++;
          break;
        case 1:
          good++;
          break;
        case -1:
          bad++;
          break;
      }

      /*make array of total days in dataset => totalDaysInDataset*/
      var datumActivityShares = parseInt(data[i].activity_shares);
      if ((datumActivityShares) && (datumActivityShares > 0)) totalActivityShares++;
      var date = data[i].activity_date;
      if (totalDaysInDataset.indexOf(date) === -1) {
        totalDaysInDataset.push(date);
      }
    }
    /*sort totalDaysInDataset Array*/
    totalDaysInDataset = totalDaysInDataset.sort();

    dayCounterArray = totalDaysInDataset.map(x => 0);
    days = totalDaysInDataset.map(x => []);

    /*counts and sorts mentions by day*/
    for (let i = 0; i < data.length; i++) {
      let day = data[i].activity_date.toString();
      let actor = data[i];
      if ((day) && (totalDaysInDataset.indexOf(day) !== -1)) {
        let dayToIncrement = totalDaysInDataset.indexOf(day);
        dayCounterArray[dayToIncrement]++;
        days[dayToIncrement].push(actor);
      }
    }

    /*generate arrays for bar charts and labels*/
    socialMediaStats = [facebook, instagram, tumblr, twitter];

    socialMediaProviderNames = [{name: ' facebook', number: facebook}, {name: 'instagram', number: instagram}
      , {name: 'tumblr', number: tumblr}, {name: 'twitter', number: twitter}];

    socialMediaSentiment = [{name: 'Positive: ' + good, number: good}, {name: 'Negative: ' + bad, number: bad}
      , {name: 'Neutral: ' + neutral, number: neutral}];

    /* set html days_in_period div*/
    for (let i = 0; i < totalDaysInDataset.length; i++) {
      let graph = document.createElement('div');
      let headerContent = document.createTextNode(totalDaysInDataset[i] + `: ${dayCounterArray[i]}`);
      graph.appendChild(headerContent);
      daysInPeriodDiv.appendChild(graph).className = "flex_row_center";
    }

    /* set html for Sentiment Chart*/
    totalMentionsInPeriodDiv.innerHTML = data.length.toString();
    totalMentionsInPeriodDiv.classList.add('mentions')
    totalSharedMentionsDiv.innerHTML = totalActivityShares.toString();
    totalSharedMentionsDiv.classList.add('mentions');
    totalDaysDiv.innerHTML = totalDaysInDataset.length.toString();
    totalDaysDiv.classList.add('mentions');
    avgMentions = Math.round((data.length / totalDaysInDataset.length)).toString();
    avgMentionsPerDay.innerHTML = avgMentions;
    avgMentionsPerDay.classList.add('mentions');

    /*set html for sentiment percentage display*/
    var total = good + bad + neutral,
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      totalPercentage,

      positiveSentimentPercentage = document.getElementById('positive_sentiment_percentage'),
      negativeSentimentPercentage = document.getElementById('negative_sentiment_percentage'),
      neutralSentimentPercentage = document.getElementById('neutral_sentiment_percentage');

    positivePercentage = Math.round(100 * (good / total).toFixed(4));
    negativePercentage = Math.round(100 * (bad / total).toFixed(4));
    neutralPercentage = Math.round(100 * (neutral / total).toFixed(4));
    totalPercentage = positivePercentage + negativePercentage + neutralPercentage;
    if (totalPercentage !== 100) {
      if (totalPercentage > 100) neutralPercentage--;
      if (totalPercentage < 100) neutralPercentage++;
    }
    positiveSentimentPercentage.innerHTML = positivePercentage + "%";
    negativeSentimentPercentage.innerHTML = negativePercentage + "%";
    neutralSentimentPercentage.innerHTML = neutralPercentage + "%";

  }

  function setIndvidualActorModalContent(d) {
    var
      actorAvator = document.getElementById('actor_avator'),
      actorName = document.getElementById('actor_name'),
      actorActivityShares = document.getElementById('mention_modal_shares'),
      actorUserName = document.getElementById('actor_username'),
      actorDescription = document.getElementById('actor_description'),
      replyUserName = document.getElementById('reply_username'),
      actorUrl = document.getElementById('actor_url'),
      activityMessage = document.getElementById('activity_message'),
      activityDate = document.getElementById('activity_date'),
      cancelReply = document.getElementById('cancel_reply'),
      modalOverlay = document.getElementById('modal_overlay'),
      modal = document.getElementById('modal'),
      replyModalBody = document.getElementById('reply_modal'),
      provider = document.getElementById('provider');

    switch (d.provider) {
      case "twitter":
        provider.innerHTML = `<i class='fa fa-twitter-square twitter'></i> &nbsp; <i class='fa fa-reply change_cursor reply'></i> &nbsp;  <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class='fa fa-star change_cursor'></i> &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>`;
        break;
      case "facebook":
        provider.innerHTML = `<i class=  'fa fa-facebook-square facebook'></i> &nbsp; <i class=  'fa fa-reply change_cursor reply'></i> &nbsp; <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class='fa fa-star change_cursor'></i>&nbsp;  <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>`;
        break;
      case "instagram":
        provider.innerHTML = `<i class=  'fa fa-instagram instagram'></i> &nbsp; <i class=  'fa fa-reply change_cursor reply'></i> &nbsp;  <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=  'fa fa-star change_cursor'></i>  &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>`;
        break;
      case "tumblr":
        provider.innerHTML = `<i class=  'fa fa-tumblr-square tumblr'></i> &nbsp; <i class=  'fa fa-reply change_cursor reply'></i> &nbsp; <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=  'fa fa-star change_cursor'></i> &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>`;
        break;
    }

    modalOverlay.onclick = function () {
      modal.classList.toggle('visible');
      replyModalBody.classList.add('hide_display');
      modalOverlay.classList.toggle('hide_display');
    };
    provider.onclick = function openReplyModalFn() {
      replyModalBody.classList.toggle('hide_display');
    };
    cancelReply.onclick = function () {
      replyModalBody.classList.add('hide_display')
    };

    modal.classList.toggle('visible');
    modalOverlay.classList.toggle('hide_display');

    /*set HTML for actor modal*/
    var start;
    if (d.activity_date.length === 18) start = d.activity_date.length - 8;
    else if (d.activity_date.length === 17) start = d.activity_date.length - 7;
    else start = d.activity_date.length - 9;
    actorAvator.src = d.actor_avator;
    actorName.innerHTML = d.actor_name;
    actorUserName.innerHTML = d.actor_username;
    actorDescription.innerHTML = d.actor_description;
    replyUserName.innerHTML = d.actor_username;
    actorUrl.href = d.actor_url;
    actorUrl.innerHTML = d.actor_url;
    activityMessage.innerHTML = d.activity_message;
    activityDate.innerHTML = d.activity_date.split('').slice(0, start).join('');
    actorActivityShares.innerHTML = d.activity_shares;
    provider.className = "flex_row_start";

  }

  function showPage() {
    var
      pageContent = document.getElementById("page_content"),
      loaded = document.getElementById("loaded"),
      spin = document.getElementById("spin"),
      loading = document.getElementById("loading");

    spin.style.display = "none";
    loading.style.display = "none";
    loaded.style.display = "none";
    pageContent.style.display = "block";
  }


  var
    dayCounterArray,
    days = [],
    totalDaysInDataset = [],
    socialMediaStats = 0,
    socialMediaProviderNames,
    socialMediaSentiment,

    publicApi = {
      generateProviderBarChart: generateProviderBarChart,
      generateSentimentBarChart: generateSentimentBarChart,
      generateHourlyMentionsLineGraph: generateHourlyMentionsLineGraph,
      generateIndividualActorGraph: generateIndividualActorGraph,
      processActorsMentions: processActorsMentions,
      showPage: showPage,
    };

  return publicApi;

})();

fetch('https://nuvi-challenge.herokuapp.com/activities')
  .then(function (response) {
    return response.json()
  }).then(function (actorsMentions) {
  DashBoardManager.showPage();
  DashBoardManager.processActorsMentions(actorsMentions);
  DashBoardManager.generateProviderBarChart();
  DashBoardManager.generateSentimentBarChart();
  DashBoardManager.generateHourlyMentionsLineGraph(actorsMentions, 850);
  DashBoardManager.generateIndividualActorGraph();

});













