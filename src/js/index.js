require('../scss/base.scss');

(function () {

  var JSONData = [],
    socialMedia,
    socialMedia2,
    socialMediaStats = 0,
    socialMediaSentiment,
    totalActivityShares = 0,
    dayCounterArray,
    datasetWithUpdatedDate = [],
    days = [[], [], []],
    totalDaysInDataset = [],
    mentionsPerHour = [];

    var modalContent,
    reply,
    modalOverlay;

  var facebook = 0,
    instagram = 0,
    tumblr = 0,
    twitter = 0,

    good = 0,
    bad = 0,
    neutral = 0;

  var hourCounter = [],
    mentionCounter,
    hourMentionCombined = [],
  dateParse;

  /*Get actors data from servers */

  fetch('https://nuvi-challenge.herokuapp.com/activities').then(function (response) {
    return response.json()
  }).then(function (returnedValue) {
    JSONData = returnedValue;
  }).then(function () {

    mapActorsData(JSONData);
    createProviderStats();
    createHourForDate();
    createMentionsStats();
    hourMentionArrayGenerator();

  }).then(function () {
    displayIndividualActorsData();
    createProviderBarChart();
    generateSentimentBarChart();
    generateSentimentBarChart();
    generateHourlyMentionsLG(hourMentionCombined);
    // workitLG(hourMentionCombined);
  });

  function makeArray(array, d) {
    array.push(d)
  }

  function incArray(array, index) {
    array[index]++;
  }

  function createHourForDate() {
    let dataset = JSONData.slice();
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


    function makeMentionCounterArray(array, hour) {
      array[hour]++
    }

    function generateHourlyMentions(mentionCounter) {
      var dataset = datasetWithUpdatedDate;
      for (let i = 0; i < dataset.length; i++) {
        let day = dataset[i].timeHour.toString();
        if ((day) && (hourCounter.indexOf(day) !== -1)) {
          let hourToIncrement = parseInt(hourCounter.indexOf(day));
          makeMentionCounterArray(mentionCounter, hourToIncrement);
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
  function mapActorsData() {

    let dataset = JSONData.slice();

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
        document.getElementById('positive_sentiment_percentage').innerHTML = positivePercentage + "%";
        document.getElementById('negative_sentiment_percentage').innerHTML = negativePercentage + "%";
        document.getElementById('neutral_sentiment_percentage').innerHTML = neutralPercentage + "%";
      })
      .catch(function () {
        console.log('provider percentage error');
      })
  }

  function createMentionsStats() {
    var avgMentionsPerDay;

    document.getElementById('total_mentions_in_period').innerHTML = JSONData.length.toString();
    document.getElementById('total_shared_mentions').innerHTML = totalActivityShares.toString();
    document.getElementById('total_days').innerHTML = totalDaysInDataset.length.toString();

    function addDaysInDataset() {

      var divToInsertOn = document.getElementById('days_in_period');

      for (let i = 0; i < totalDaysInDataset.length; i++) {
        let newDiv = document.createElement('div');
        let content = document.createTextNode(totalDaysInDataset[i] + `: ${dayCounterArray[i]}`);
        newDiv.appendChild(content);
        divToInsertOn.appendChild(newDiv).className = "flex_row_center";
      }
    }

    addDaysInDataset();

    avgMentionsPerDay = Math.round((JSONData.length / totalDaysInDataset.length)).toString();
    document.getElementById('avg_mentions_day').innerHTML = avgMentionsPerDay;
  }

  function setModalFn(d) {

    modalOverlay = document.getElementById('modal_overlay');
    var modal = document.getElementById('modal');
    var replyModalBody = document.getElementById('reply_modal');
    var reply = document.getElementById('provider');

    var cancelReply = document.getElementById('cancel_reply');
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
          document.getElementById('provider').innerHTML = "<i class=" + "'fa fa-twitter-square'></i> &nbsp;  <i class=" + "'fa fa-star change_cursor'></i> &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "facebook":
          document.getElementById('provider').innerHTML = "<i class=" + "'fa fa-facebook'></i> &nbsp; <i class=" + "'fa fa-star change_cursor'></i>  &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "instagram":
          document.getElementById('provider').innerHTML = "<i class=" + "'fa fa-instagram'></i>&nbsp;  <i class=" + "'fa fa-star change_cursor'></i>  &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        case "tumblr":
          document.getElementById('provider').innerHTML = "<i class=" + "'fa fa-tumblr-square'></i> &nbsp; <i class=" + "'fa fa-star change_cursor'></i> &nbsp; <i class=" + "'fa fa-reply change_cursor'></i>";
          break;
        default:
          break;
      }
    })(d);


    // var format = d3.time.format("%Y-%m-%d-%H-%M-%S");

    /*use promise to wait for the actor_avator pic to load before opening modal*/

    // let p1 = new Promise(
    //   function (resolve, reject) {
    //     var avatar = document.getElementById('actor_avator');
    var start;
    if (d.activity_date.length === 18) start = d.activity_date.length -8;
    else if(d.activity_date.length === 17) start = d.activity_date.length - 7;
    else start = d.activity_date.length - 9;
    
    document.getElementById('actor_avator').src = d.actor_avator;
    document.getElementById('actor_name').innerHTML = d.actor_name;
    document.getElementById('actor_username').innerHTML = d.actor_username;
    document.getElementById('actor_description').innerHTML = d.actor_description;
    document.getElementById('reply_username').innerHTML = d.actor_username;
    document.getElementById('actor_url').src = d.actor_url;
    document.getElementById('actor_url').innerHTML = d.actor_url;
    document.getElementById('activity_message').innerHTML = d.activity_message;
    document.getElementById('activity_date').innerHTML = d.activity_date.split('').slice(0,start).join('');
    document.getElementById('provider').className = "flex_row_start";
    // avatar.onload = function () {
    //   resolve();
    // }});
    // p1.then(function () {
    //   console.log('modal set, toggle modal');
    toggleModalFn();
    // })
  }

  function toggleModalFn() {
    modalOverlay = document.getElementById('modal_overlay');
    reply = document.getElementById('provider');
    modalContent = document.getElementById('modal');
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

    var w = "100%";
    var h = "50%";

    var padding = 4;

    d3.select("#mentions_wrapper").append("svg2")
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

    var w = "100%";
    var h = "50%";

    var padding = 4,
      social;

    social = socialMediaSentiment;

    var sentimentStats = social.map((x)=> {
      return x.number;
    });

    function mouseovered() {
      var bar = d3.select(this);
      bar.attr("fill", function () {
        return "white";
      })
    }

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


  function generateHourlyMentionsLG(data) {

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

// Define the line  TODO pass in date
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
        "translate(" + margin.left + "," + margin.top + ")")

    function getTheData(data) {
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
  
})();








