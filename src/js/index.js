require('../scss/base.scss');

var DashBoardManager = (function () {

  function makeArray(array, d) {
    array.push(d)
  }

  function incArray(array, index) {
    array[index]++;
  }

  function createHourForDate(data) {
    let dataset = data;
    for (var i = 0; i < dataset.length; i++) {
      var hour = Math.random() * (24) | 0;
      var minutes = Math.random() * (60) | 0;
      var seconds = Math.random() * (60) | 0;
      hour = hour + "-" + minutes + "-" + seconds;
    }

    function randomTimeGenerator(data) {
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
        makeArray(datasetWithUpdatedDate, data[i]);
        makeArray(mentionsPerHour, hours)
      }
    }

    randomTimeGenerator(dataset);
  }

  function hourMentionArrayGenerator() {
    function generateHourlyMentionTimes() {
      var dataset = datasetWithUpdatedDate;
      for (let i = 0; i < dataset.length; i++) {
        let day = dataset[i].timeHour.toString();
        if ((day) && (hourCounter.indexOf(day) === -1)) {
          makeArray(hourCounter, day);
        }
      }
      hourCounter = hourCounter.sort();
      mentionCounter = hourCounter;
      mentionCounter = mentionCounter.map((x) => 0);
      generateHourlyMentions(mentionCounter)
    }
    generateHourlyMentionTimes(datasetWithUpdatedDate);


    function generateHourlyMentions(mentionCounter) {
      var dataset = datasetWithUpdatedDate;
      for (let i = 0; i < dataset.length; i++) {
        let day = dataset[i].timeHour.toString();
        if ((day) && (hourCounter.indexOf(day) !== -1)) {
          let hourToIncrement = parseInt(hourCounter.indexOf(day));
          incArray(mentionCounter, hourToIncrement);
        }
      }
      generateHourMentionObjArray()
    }

    function makeHourlyObjArray(array, hour, mention) {
      let obj = {"date": hour, "close": mention};
      array.push(obj)
    }

    function generateHourMentionObjArray() {
      for (let i = 0; i < hourCounter.length; i++) {
        let hour = hourCounter[i].toString();
        let mention = mentionCounter[i];
        makeHourlyObjArray(hourMentionCombined, hour, mention)
      }
    }
  }

  /* map the data for use in charts*/
  function mapActorsData(data) {
    let dataset = data;

    for (let i = 0; i < dataset.length; i++) {
      switch (dataset[i].provider) {
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
        default:
          break;
      }
    }

    /* getting total activity shares*/
    for (let i = 0; i < dataset.length; i++) {
      var datum = parseInt(dataset[i].activity_shares);
      if ((datum) && (datum > 0)) totalActivityShares++;
    }

    /*getting mentions per day*/
    for (let i = 0; i < dataset.length; i++) {
      var date = dataset[i].activity_date;
      if (totalDaysInDataset.indexOf(date) === -1) {
        totalDaysInDataset.push(dataset[i].activity_date)
      }
    }
    totalDaysInDataset = totalDaysInDataset.sort();

    /*get mentions total by day*/
    dayCounterArray = totalDaysInDataset;
    dayCounterArray = dayCounterArray.map((x) => 0);
    
    function makeHourObjArray(array, index, actor) {
      array[index].push(actor)
    }
    
    for (let i = 0; i < dataset.length; i++) {
      let day = dataset[i].activity_date.toString();
      let actor = dataset[i];
      if ((day) && (totalDaysInDataset.indexOf(day) !== -1)) {
        let dayToIncrement = parseInt(totalDaysInDataset.indexOf(day));
        incArray(dayCounterArray, dayToIncrement);
        makeHourObjArray(days, dayToIncrement, actor)
      }
    }

    /*  mapping data for sentiment charts*/
    for (let i = 0; i < dataset.length; i++) {
      switch (dataset[i].activity_sentiment) {
        case 0:
          neutral++;
          break;
        case 1:
          good++;
          break;
        case -1:
          bad++;
          break;
        default:
          break;
      }
    }

    socialMediaStats = [facebook, instagram, tumblr, twitter];

    socialMedia = [{name: 'FB: ' + facebook, number: facebook}, {name: 'IG:' + instagram, number: instagram}
      , {name: 'TBLR:' + tumblr, number: tumblr}, {name: 'TWTR:' + twitter, number: twitter}];

    socialMedia2 = [{name: ' facebook', number: facebook}, {name: 'instagram', number: instagram}
      , {name: 'tumblr', number: tumblr}, {name: 'twitter', number: twitter}];

    socialMediaSentiment = [{name: 'Positive: ' + good, number: good}, {name: 'Negative: ' + bad, number: bad}
      , {name: 'Neutral: ' + neutral, number: neutral}];

  }

  function createProviderStats() {
    var total = good + bad + neutral,
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      totalPercentage;

    let p1 = new Promise(function (resolve, reject) {

        positivePercentage = Math.round(100 * (good / total).toFixed(4));
        negativePercentage = Math.round(100 * (bad / total).toFixed(4));
        neutralPercentage = Math.round(100 * (neutral / total).toFixed(4));
        totalPercentage = positivePercentage + negativePercentage + neutralPercentage;
        if (totalPercentage !== 100) {
          if (totalPercentage > 100) neutralPercentage--;
          if (totalPercentage < 100) neutralPercentage++;
        }
        resolve()
      }
    );

    p1.then(function () {
        positiveSentimentPercentage.innerHTML = positivePercentage + "%";
        negativeSentimentPercentage.innerHTML = negativePercentage + "%";
        neutralSentimentPercentage.innerHTML = neutralPercentage + "%";
      })
      .catch(function () {
        console.log('provider percentage error');
      })
  }

  function createMentionsStats(data) {
    var avgMentions;

    totalMentionsInPeriod.innerHTML = data.length.toString();
    totalSharedMentions.innerHTML = totalActivityShares.toString();
    totalDays.innerHTML = totalDaysInDataset.length.toString();

    function addDaysInDataset() {
      for (let i = 0; i < totalDaysInDataset.length; i++) {
        let newDiv = document.createElement('div');
        let content = document.createTextNode(totalDaysInDataset[i] + `: ${dayCounterArray[i]}`);
        newDiv.appendChild(content);
        divToInsertOn.appendChild(newDiv).className = "flex_row_center";
      }
    }

    addDaysInDataset();
    avgMentions = Math.round((data.length / totalDaysInDataset.length)).toString();
    avgMentionsPerDay.innerHTML = avgMentions;
  }

  function setModalFn(d) {
    modalOverlay.onclick = function () {
      modal.classList.toggle('visible');
      replyModalBody.classList.add('hide_display');
      modalOverlay.classList.toggle('hide_display');
    };

    reply.onclick = function openReplyModalFn() {
      replyModalBody.classList.toggle('hide_display');
    };

    cancelReply.onclick = function () {
      replyModalBody.classList.add('hide_display')
    };

    (function (d) {
      switch (d.provider) {
        case "twitter":
          provider.innerHTML = "<i class=" + "'fa fa-twitter-square'></i> &nbsp;  <i class=" + "'fa fa-star change_cursor'></i> &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "facebook":
          provider.innerHTML = "<i class=" + "'fa fa-facebook'></i> &nbsp; <i class=" + "'fa fa-star change_cursor'></i>  &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "instagram":
          provider.innerHTML = "<i class=" + "'fa fa-instagram'></i>&nbsp;  <i class=" + "'fa fa-star change_cursor'></i>  &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "tumblr":
          provider.innerHTML = "<i class=" + "'fa fa-tumblr-square'></i> &nbsp; <i class=" + "'fa fa-star change_cursor'></i> &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        default:
          break;
      }
    })(d);

    /*use promise to wait for the actor_avator pic to load before opening modal*/

    // let p1 = new Promise(
    //   function (resolve, reject) {
    //     var avatar = document.getElementById('actor_avator');
    var start;
    if (d.activity_date.length === 18) start = d.activity_date.length - 8;
    else if (d.activity_date.length === 17) start = d.activity_date.length - 7;
    else start = d.activity_date.length - 9;

    actorAvator.src = d.actor_avator;
    actorName.innerHTML = d.actor_name;
    actorUserName.innerHTML = d.actor_username;
    actorDescription.innerHTML = d.actor_description;
    replyUserName.innerHTML = d.actor_username;
    actorUrl.src = d.actor_url;
    actorUrl.innerHTML = d.actor_url;
    activityMessage.innerHTML = d.activity_message;
    activityDate.innerHTML = d.activity_date.split('').slice(0, start).join('');
    provider.className = "flex_row_start";
    // avatar.onload = function () {
    //   resolve();
    // }});
    // p1.then(function () {
    //   console.log('modal set, toggle modal');
    toggleModalFn();
    // })
  }

  function toggleModalFn() {
    modalContent.classList.toggle('visible');
    modalOverlay.classList.toggle('hide_display');
  }

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

  function createProviderBarChart() {
    var w = "100%",
      h = "50%",
      padding = 4;

    d3.select("#mentions_wrapper").append("svg")
      .attr("width", w)
      .attr("height", h);

    var x = d3.scale.linear()
      .domain([0, d3.max(socialMediaStats)])
      .range([0, 420]);

    d3.select("#reach")
      .selectAll("div")
      .data(socialMedia2)
      .enter().append("div")
      .style("width", function (d) {
        return x(d.number) + "px";
      })
      .style("margin", ".75em 4px 1em 6px")
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
    console.log('generateSentimentBarChart');
    var
      w = "100%",
      h = "50%",
      padding = 4,
      social;

    social = socialMediaSentiment;

    var sentimentStats = social.map((x)=> {
      return x.number;
    });

    d3.select("#test").append("svg2")
      .attr("width", w)
      .attr("height", h);

    var x = d3.scale.linear()
      .domain([0, d3.max(sentimentStats)])
      .range([0, 420]);

    d3.select("#sentiment_timeline_bod")
      .selectAll("div")
      .data(social)
      .enter().append("div")
      .style("width", function (d) {
        return x(d.number) + "px";
      })
      .style("margin", ".75em 4px 1em 6px")
      .style("padding-left", ".75em")
      .attr("id", function (d, i) {
        // setColoringFn(d);
        var result = 'sentiment' + i;
        return result;
      })
      .text(function (d) {
        return d.name; //+ ": " + d.value;
      });

  }

  function generateHourlyMentionsLineGraph() {
    console.log('generateHourlyMentionsLineGraph');
    var data = hourMentionCombined;
    // Set the dimensions of the canvas / graph
    var margin = {top: 13, right: 10, bottom: 25, left: 30},
      width = 850 - margin.left - margin.right,
      height = 170 - margin.top - margin.bottom;

// Parse the date / time

    var parseDate = d3.time.format("%Y-%m-%d-%H").parse;

// Set the ranges

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

// Define the axes
    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(15);

    var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

// Define the line
    var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.close);
      });

// Adds the svg canvas
    var svg = d3.select("#mentions_timeline_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    function getTheData(data) {
      console.log('getTheDataFn');
      data.map(function (d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function (d) {
        return d.date;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.close;
      })]);

      // Add the valueline path.
      svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

      // Add the X Axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Add the Y Axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    }

    getTheData(data);
  }

  var
    socialMedia,
    socialMedia2,
    socialMediaStats = 0,
    socialMediaSentiment,
    totalActivityShares = 0,
    dayCounterArray,
    datasetWithUpdatedDate = [],
    days = [[], [], []],
    totalDaysInDataset = [],
    mentionsPerHour = [],
    facebook = 0,
    instagram = 0,
    tumblr = 0,
    twitter = 0,
    good = 0,
    bad = 0,
    neutral = 0,
    hourCounter = [],
    mentionCounter,
    hourMentionCombined = [],
  // modal elements
    modalOverlay = document.getElementById('modal_overlay'),
    modal = document.getElementById('modal'),
    modalContent = document.getElementById('modal'),
    replyModalBody = document.getElementById('reply_modal'),
    reply = document.getElementById('provider'),
    cancelReply = document.getElementById('cancel_reply'),
    actorAvator = document.getElementById('actor_avator'),
    actorName = document.getElementById('actor_name'),
    actorUserName = document.getElementById('actor_username'),
    actorDescription = document.getElementById('actor_description'),
    replyUserName = document.getElementById('reply_username'),
    actorUrl = document.getElementById('actor_url'),
    activityMessage = document.getElementById('activity_message'),
    activityDate = document.getElementById('activity_date'),
    provider = document.getElementById('provider'),

  //DOM refs
    totalMentionsInPeriod = document.getElementById('total_mentions_in_period'),
    totalSharedMentions = document.getElementById('total_shared_mentions'),
    totalDays = document.getElementById('total_days'),
    avgMentionsPerDay = document.getElementById('avg_mentions_day'),
    divToInsertOn = document.getElementById('days_in_period'),
    positiveSentimentPercentage = document.getElementById('positive_sentiment_percentage'),
    negativeSentimentPercentage = document.getElementById('negative_sentiment_percentage'),
    neutralSentimentPercentage = document.getElementById('neutral_sentiment_percentage'),


    publicApi = {
      mapActorsData: mapActorsData,
      createProviderStats: createProviderStats,
      createHourForDate: createHourForDate,
      createMentionsStats: createMentionsStats,
      hourMentionArrayGenerator: hourMentionArrayGenerator,
      displayIndividualActorsData: displayIndividualActorsData,
      createProviderBarChart: createProviderBarChart,
      generateSentimentBarChart: generateSentimentBarChart,
      generateHourlyMentionsLineGraph: generateHourlyMentionsLineGraph
    };

  return publicApi;

})();

fetch('https://nuvi-challenge.herokuapp.com/activities')
  .then(function (response) {
    return response.json()
  }).then(function (actorsData) {
  DashBoardManager.mapActorsData(actorsData);
  DashBoardManager.createProviderStats();
  DashBoardManager.createHourForDate(actorsData);
  DashBoardManager.createMentionsStats(actorsData);
  DashBoardManager.hourMentionArrayGenerator();
  DashBoardManager.displayIndividualActorsData();
  DashBoardManager.createProviderBarChart();
  DashBoardManager.generateSentimentBarChart();
  DashBoardManager.generateHourlyMentionsLineGraph();
});









