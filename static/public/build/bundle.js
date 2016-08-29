!function(e) {
    function t(n) {
        if (r[n]) return r[n].exports;
        var o = r[n] = {
            exports: {},
            id: n,
            loaded: !1
        };
        return e[n].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports;
    }
    var r = {};
    return t.m = e, t.c = r, t.p = "", t(0);
}([ function(e, t, r) {
    e.exports = r(1);
}, function(e, t, r) {
    "use strict";
    r(5);
    var n = function() {
        function e() {
            function e(e, t) {
                for (var r = document.getElementById("actor_graph_header"), n = document.getElementById("view_mentions"), o = document.getElementsByClassName("tabcontent"), a = 0; a < o.length; a++) o[a].style.display = "none";
                r.style.display = "block", e.currentTarget.className += " active", n.style.display = "block", 
                e.currentTarget.className += " active", document.getElementById(t).style.display = "block", 
                e.currentTarget.className += " active";
            }
            function t(e, t) {
                function r(e) {
                    for (var t = 0; t < y.length; t++) {
                        var r = y[t];
                        r.radius = p(r), r = n(.1 * e.alpha)(r), r = o(.5)(r), r.cx = r.x, r.cy = r.y;
                    }
                }
                function n(e) {
                    return function(t) {
                        return t.y += (t.idealcy - t.y) * e, t.x += (t.idealcx - t.x) * e * 3, t;
                    };
                }
                function o(e) {
                    var t = d3.geom.quadtree(y);
                    return function(r) {
                        var n = r.radius + x + h, o = r.x - n, a = r.x + n, i = r.y - n, d = r.y + n;
                        return t.visit(function(t, n, s, l, p) {
                            if (t.point && t.point !== r) {
                                var c = r.x - t.point.x, m = r.y - t.point.y, f = Math.sqrt(c * c + m * m), _ = r.radius + t.point.radius + h;
                                f < _ && (f = (f - _) / f * e, r.x -= c *= f, r.y -= m *= f, t.point.x += c, t.point.y += m);
                            }
                            return n > a || l < o || s > d || p < i;
                        }), r;
                    };
                }
                function i() {
                    w.start();
                    for (var e = 45; e > 0; --e) w.tick();
                    w.stop(), k.append("g").attr("class", "x axis").attr("transform", "translate(0," + (_.top + 3 * g / 4) + ")").call(v);
                    var t = (k.selectAll("circle").data(y).enter().append("circle").style("fill", function(e) {
                        return e.color;
                    }).attr("cx", function(e) {
                        return e.x;
                    }).attr("cy", function(e) {
                        return e.y;
                    }).attr("stroke", function() {
                        return "black";
                    }).attr("stroke-width", function() {
                        return 1;
                    }).attr("r", function(e) {
                        return p(e);
                    }).style("display", "block").style("cursor", "pointer").on("mouseover", s).on("mouseout", l).on("click", function(e) {
                        a(e.modalData);
                    }), k.append("svg:g").selectAll("g").data(w.nodes()).enter().append("svg:g"));
                    t.append("svg:text").attr("text-anchor", "middle").text(function(e) {
                        return c(e);
                    }).style("fill", "#F8F8F8").style("stroke", "black").style("stroke-width", ".02em").style("display", "block").style("cursor", "pointer").on("click", function(e) {
                        a(e.modalData);
                    }), t.attr("transform", function(e) {
                        return e.y = e.y + .02 * e.y, "translate(" + e.x + "," + e.y + ")";
                    }), L.remove();
                }
                var d = function(e) {
                    return f.parse(e.activity_date);
                }, s = function() {
                    var e = d3.select(this);
                    e.attr("stroke", function() {
                        return "white";
                    });
                }, l = function() {
                    var e = d3.select(this);
                    e.attr("stroke", function() {
                        return "black";
                    });
                }, p = function(e) {
                    return e.idealradius <= 10 ? e.idealradius + 7 : .33 * e.idealradius;
                }, c = function(e) {
                    return 1 === e.modalData.activity_sentiment ? "+" : e.modalData.activity_sentiment === -1 ? "-" : void 0;
                }, m = e, f = d3.time.format("%Y-%m-%d-%H-%M-%S"), _ = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }, u = 1265 - _.left - _.right, g = 335 - _.top - _.bottom, h = 0, x = 100, b = d3.time.scale().range([ 60, 1200 ]).domain(d3.extent(m, d)), y = m.map(function(e) {
                    return {
                        idealradius: e.activity_shares,
                        radius: 0,
                        modalData: e,
                        color: function() {
                            var t = 0 == e.activity_sentiment ? "#0F4651" : 1 == e.activity_sentiment ? "#1CC222" : "#CA2F2B";
                            return t;
                        }(),
                        idealcx: b(d(e)),
                        idealcy: g / 2,
                        x: b(d(e)),
                        y: g / 3 + Math.random()
                    };
                }), w = d3.layout.force().nodes(y).size([ u, g ]).gravity(0).charge(0).on("tick", r).start(), v = d3.svg.axis().scale(b).orient("bottom").ticks(14), k = d3.select("#actorGraph" + t).append("svg").attr("width", u + _.left + _.right).attr("height", g + _.top + _.bottom).attr("id", "modal" + t).attr("class", "tabcontent").style("background-color", "black").style("border-bottom", "1px solid #1B1B1B").style("margin-bottom", "20px").style("padding-bottom", "8px").style("box-shadow", "0 0px 15px 5px rgba(0, 0, 0, 1)"), L = k.append("text").attr("id", "modal" + t).attr("class", "tabcontent").attr("x", (u + _.left + _.right) / 2).attr("y", (g + _.top + _.bottom) / 2).attr("dy", ".35em").style("text-anchor", "middle").text("Simulating. One moment please…");
                i();
            }
            var r = document.getElementById("actor_graph"), n = document.getElementById("date_select");
            n.onchange = function(t) {
                var r = "modal" + t.srcElement.value;
                e(t, r), window.scrollTo(0, document.body.scrollHeight);
            };
            for (var o = p.length - 1; o >= 0; o--) {
                var i = document.createElement("div"), d = document.createElement("option");
                i.classList.add("flex_row_center"), i.id = "actorGraph" + o, d.value = "" + o, d.innerHTML = "" + c[o], 
                n.appendChild(d), r.appendChild(i), t(p[o], o);
            }
        }
        function t(e) {
            function t() {
                e.map(function(e) {
                    e.date = y(e.date), e.close = +e.close;
                }), w.domain(d3.extent(e, function(e) {
                    return e.date;
                })), v.domain([ 0, d3.max(e, function(e) {
                    return e.close;
                }) ]), E.append("path").attr("class", "line").attr("d", B(e)), E.append("g").attr("class", "x axis").attr("transform", "translate(0," + b + ")").call(k), 
                E.append("g").attr("class", "y axis").call(L);
            }
            for (var r, n, o = [], a = [], i = [], d = 0; d < e.length; d++) {
                var s = 24 * Math.random() | 0;
                s < 10 && (s = "0" + s);
                var l = s, p = 60 * Math.random() | 0, c = 60 * Math.random() | 0;
                l = "-" + l + "-" + p + "-" + c, e[d].timeHour = e[d].activity_date + "-" + s, e[d].activity_date = e[d].activity_date + l, 
                e[d].hour = s, i.push(e[d]);
            }
            n = i;
            for (var d = 0; d < n.length; d++) {
                var m = n[d].timeHour.toString();
                m && o.indexOf(m) === -1 && o.push(m);
            }
            r = o.sort().map(function(e) {
                return 0;
            });
            for (var d = 0; d < n.length; d++) {
                var m = n[d].timeHour.toString();
                if (m && o.indexOf(m) !== -1) {
                    var f = parseInt(o.indexOf(m));
                    r[f]++;
                }
            }
            for (var d = 0; d < o.length; d++) {
                var _ = o[d].toString(), u = r[d], g = {
                    date: _,
                    close: u
                };
                a.push(g);
            }
            e = a;
            var h = {
                top: 13,
                right: 10,
                bottom: 25,
                left: 30
            }, x = 850 - h.left - h.right, b = 170 - h.top - h.bottom, y = d3.time.format("%Y-%m-%d-%H").parse, w = d3.time.scale().range([ 0, x ]), v = d3.scale.linear().range([ b, 0 ]), k = d3.svg.axis().scale(w).orient("bottom").ticks(13), L = d3.svg.axis().scale(v).orient("left").ticks(5), B = d3.svg.line().x(function(e) {
                return w(e.date);
            }).y(function(e) {
                return v(e.close);
            }), E = d3.select("#mentions_timeline_chart").append("svg").attr("width", x + h.left + h.right).attr("height", b + h.top + h.bottom).append("g").attr("transform", "translate(" + h.left + "," + h.top + ")");
            t();
        }
        function r() {
            var e = "410", t = "230";
            d3.select("#mentions_wrapper").append("svg").attr("width", e).attr("height", t);
            var r = d3.scale.linear().domain([ 0, d3.max(m) ]).range([ 5, 380 ]);
            d3.select("#mentions_per_provider_graph").selectAll("div").data(s).enter().append("div").style("width", function(e) {
                return r(e.number) + "px";
            }).style("margin", "1em 4px 1em 6px").style("padding-left", ".75em").attr("id", function(e, t) {
                var r = "social_media" + t;
                return r;
            }).text(function(e) {
                return e.name + ": " + e.number;
            });
        }
        function n() {
            var e, t = "410", r = "230";
            e = l;
            var n = e.map(function(e) {
                return e.number;
            });
            d3.select("#test").append("svg").attr("width", t).attr("height", r);
            var o = d3.scale.linear().domain([ 0, d3.max(n) ]).range([ 5, 390 ]);
            d3.select("#sentiment_timeline_body").selectAll("div").data(e).enter().append("div").style("width", function(e) {
                return o(e.number) + "px";
            }).style("margin", ".75em 4px 1em 6px").style("padding-left", ".75em").attr("id", function(e, t) {
                var r = "sentiment" + t;
                return r;
            }).text(function(e) {
                return e.name;
            });
        }
        function o(e) {
            for (var t, r = 0, n = 0, o = 0, a = 0, i = 0, f = 0, _ = 0, u = 0, g = document.getElementById("total_mentions_in_period"), h = document.getElementById("total_shared_mentions"), x = document.getElementById("total_days"), b = document.getElementById("avg_mentions_day"), y = document.getElementById("days_in_period"), w = 0; w < e.length; w++) {
                switch (e[w].provider) {
                  case "twitter":
                    a++;
                    break;

                  case "facebook":
                    r++;
                    break;

                  case "instagram":
                    n++;
                    break;

                  case "tumblr":
                    o++;
                }
                switch (e[w].activity_sentiment) {
                  case 0:
                    _++;
                    break;

                  case 1:
                    i++;
                    break;

                  case -1:
                    f++;
                }
                var v = parseInt(e[w].activity_shares);
                v && v > 0 && u++;
                var k = e[w].activity_date;
                c.indexOf(k) === -1 && c.push(k);
            }
            c = c.sort(), d = c.map(function(e) {
                return 0;
            }), p = c.map(function(e) {
                return [];
            });
            for (var w = 0; w < e.length; w++) {
                var L = e[w].activity_date.toString(), B = e[w];
                if (L && c.indexOf(L) !== -1) {
                    var E = c.indexOf(L);
                    d[E]++, p[E].push(B);
                }
            }
            m = [ r, n, o, a ], s = [ {
                name: " facebook",
                number: r
            }, {
                name: "instagram",
                number: n
            }, {
                name: "tumblr",
                number: o
            }, {
                name: "twitter",
                number: a
            } ], l = [ {
                name: "Positive: " + i,
                number: i
            }, {
                name: "Negative: " + f,
                number: f
            }, {
                name: "Neutral: " + _,
                number: _
            } ];
            for (var w = 0; w < c.length; w++) {
                var M = document.createElement("div"), I = document.createTextNode(c[w] + (": " + d[w]));
                M.appendChild(I), y.appendChild(M).className = "flex_row_center";
            }
            g.innerHTML = e.length.toString(), g.classList.add("mentions"), h.innerHTML = u.toString(), 
            h.classList.add("mentions"), x.innerHTML = c.length.toString(), x.classList.add("mentions"), 
            t = Math.round(e.length / c.length).toString(), b.innerHTML = t, b.classList.add("mentions");
            var z, A, T, H, j = i + f + _, C = document.getElementById("positive_sentiment_percentage"), S = document.getElementById("negative_sentiment_percentage"), N = document.getElementById("neutral_sentiment_percentage");
            z = Math.round(100 * (i / j).toFixed(4)), A = Math.round(100 * (f / j).toFixed(4)), 
            T = Math.round(100 * (_ / j).toFixed(4)), H = z + A + T, 100 !== H && (H > 100 && T--, 
            H < 100 && T++), C.innerHTML = z + "%", S.innerHTML = A + "%", N.innerHTML = T + "%";
        }
        function a(e) {
            var t = document.getElementById("actor_avator"), r = document.getElementById("actor_name"), n = document.getElementById("mention_modal_shares"), o = document.getElementById("actor_username"), a = document.getElementById("actor_description"), i = document.getElementById("reply_username"), d = document.getElementById("actor_url"), s = document.getElementById("activity_message"), l = document.getElementById("activity_date"), p = document.getElementById("cancel_reply"), c = document.getElementById("modal_overlay"), m = document.getElementById("modal"), f = document.getElementById("reply_modal"), _ = document.getElementById("provider");
            switch (e.provider) {
              case "twitter":
                _.innerHTML = '<i class=\'fa fa-twitter-square twitter\'></i> &nbsp; <i class=\'fa fa-reply change_cursor reply\'></i> &nbsp;  <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=\'fa fa-star change_cursor\'></i> &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>';
                break;

              case "facebook":
                _.innerHTML = '<i class=  \'fa fa-facebook-square facebook\'></i> &nbsp; <i class=  \'fa fa-reply change_cursor reply\'></i> &nbsp; <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=\'fa fa-star change_cursor\'></i>&nbsp;  <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>';
                break;

              case "instagram":
                _.innerHTML = '<i class=  \'fa fa-instagram instagram\'></i> &nbsp; <i class=  \'fa fa-reply change_cursor reply\'></i> &nbsp;  <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=  \'fa fa-star change_cursor\'></i>  &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>';
                break;

              case "tumblr":
                _.innerHTML = '<i class=  \'fa fa-tumblr-square tumblr\'></i> &nbsp; <i class=  \'fa fa-reply change_cursor reply\'></i> &nbsp; <i class="fa fa-retweet change_cursor" aria-hidden="true"></i> <div class="flex_row_end"></div><i class=  \'fa fa-star change_cursor\'></i> &nbsp; <i class="fa fa-flag change_cursor" aria-hidden="true"></i></div>';
            }
            c.onclick = function() {
                m.classList.toggle("visible"), f.classList.add("hide_display"), c.classList.toggle("hide_display");
            }, _.onclick = function() {
                f.classList.toggle("hide_display");
            }, p.onclick = function() {
                f.classList.add("hide_display");
            }, m.classList.toggle("visible"), c.classList.toggle("hide_display");
            var u;
            u = 18 === e.activity_date.length ? e.activity_date.length - 8 : 17 === e.activity_date.length ? e.activity_date.length - 7 : e.activity_date.length - 9, 
            t.src = e.actor_avator, r.innerHTML = e.actor_name, o.innerHTML = e.actor_username, 
            a.innerHTML = e.actor_description, i.innerHTML = e.actor_username, d.href = e.actor_url, 
            d.innerHTML = e.actor_url, s.innerHTML = e.activity_message, l.innerHTML = e.activity_date.split("").slice(0, u).join(""), 
            n.innerHTML = e.activity_shares, _.className = "flex_row_start";
        }
        function i() {
            var e = document.getElementById("page_content"), t = document.getElementById("loaded"), r = document.getElementById("spin"), n = document.getElementById("loading");
            r.style.display = "none", n.style.display = "none", t.style.display = "none", e.style.display = "block";
        }
        var d, s, l, p = [], c = [], m = 0, f = {
            generateProviderBarChart: r,
            generateSentimentBarChart: n,
            generateHourlyMentionsLineGraph: t,
            generateIndividualActorGraph: e,
            processActorsMentions: o,
            showPage: i
        };
        return f;
    }();
    fetch("https://nuvi-challenge.herokuapp.com/activities").then(function(e) {
        return e.json();
    }).then(function(e) {
        n.showPage(), n.processActorsMentions(e), n.generateProviderBarChart(), n.generateSentimentBarChart(), 
        n.generateHourlyMentionsLineGraph(e), n.generateIndividualActorGraph();
    });
}, function(e, t, r) {
    t = e.exports = r(3)(), t.push([ e.id, '.align_items_start{align-items:flex-start}.align_items_center{align-items:center}.align_items_end{align-items:flex-end}.align_content_bottom{align-content:flex-end;align-items:flex-end}.flex_column_start{justify-content:flex-start}.flex_column_center,.flex_column_start{display:flex;flex-direction:column;width:100%}.flex_column_center{justify-content:center}.flex_column_end{display:flex;flex-direction:column;width:100%;justify-content:flex-end}.flex_row_start{justify-content:flex-start}.flex_row_center,.flex_row_start{display:flex;flex-direction:row;width:100%}.flex_row_center{justify-content:center}.flex_row_end{display:flex;flex-direction:row;width:100%;justify-content:flex-end}.inset{box-shadow:inset 0 0 10px rgba(0,0,0,.8)}.outset{box-shadow:0 0 15px 0 #000}.default_font{font-family:"sans-serif",Arial}.bottom_box_shadow{margin:.25em 0}.border_box,.bottom_box_shadow{padding:.25em 0;box-shadow:0 -1px 0 0 rgba(82,78,82,.5)}.border_box{margin:0}.change_cursor{display:block;cursor:pointer}.date_padding{margin-left:83%}.fa-retweet{padding-left:.5em}.fa-flag,.fa-star{padding-right:.5em}.facebook{padding-left:.5em;color:#3b5998}.instagram{padding-left:.5em;color:#fd1d1d}.twitter{color:#1da1f2}.tumblr,.twitter{padding-left:.5em}.tumblr{color:#35465c}.reply{padding-left:.5em;color:#c8ecf2}.link{stroke:#777;stroke-width:2px}.mentions{font:15px "sans-serif",Arial;color:#fff}.node{fill:#ccc;stroke:#fff;stroke-width:2px}.tabcontent{display:none;padding:6px 9pt}path{stroke:#4682b4;stroke-width:2;fill:none}.axis line,.axis path{fill:none;stroke:#fff;stroke-width:1;shape-rendering:crispEdges}svg{font:10px Arial}.domain{stroke:#fff;stroke-width:1}.domain,.x.axis{fill:#fff;shape-rendering:crispEdges}html body{margin:0;padding:0;background-color:#1b1b1b}@media (max-width:900px){#ui_header{width:100vw}}#ui_header{position:relative;margin-bottom:0;background-color:#212121;width:100%;height:5em;box-shadow:0 0 15px 5px #000}#ui_header #header #title{position:absolute;top:25%;right:calc(50% + 540px);height:100%;color:#53c6dd;font-family:"sans-serif",Arial;font-size:2.7em}@media (max-width:900px){#top_section_wrapper{flex-direction:column}#mentions_per_sentiment_graph{float:right}}#top_section_wrapper{width:100%;height:auto;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;padding-top:2em;padding-bottom:.5em}#top_section_wrapper #mentions_wrapper{width:410px;height:230px;background-color:#2f2f2f;border-right:1px solid #1b1b1b;margin:.5em .5em .5em 4em;box-shadow:0 0 15px 5px #000;color:#5d5e5a}#top_section_wrapper #mentions_wrapper #mentions_header{display:flex;align-items:center;justify-content:flex-start;height:4em;width:410px;background-color:#0a0909;border-top:1px solid #39373a;border-radius:2px;color:transparent;text-shadow:0 0 .01em #838088;font-family:"sans-serif",Arial;font-size:.8em}#top_section_wrapper #mentions_wrapper #mentions_header #total_mentions_in_period{font-size:2.5em;color:transparent;margin-right:.5em;padding-left:.5em;text-shadow:0 0 .02em #53c6dd}#top_section_wrapper #mentions_wrapper #mentions_body_wrapper{font-size:.95em;padding:1em 10%}#top_section_wrapper #mentions_per_sentiment_graph{box-shadow:0 0 15px 5px #000;width:860px;height:230px;margin:.5em 4em .5em .5em;border-top:1px solid #39373a;background-color:#2f2f2f;fill:#fff;stroke:#fff;stroke-width:.3;font-family:"sans-serif",Arial}#top_section_wrapper #mentions_per_sentiment_graph #mentions_timeline_header{border-left:1px solid #1b1b1b;display:flex;height:4em;background-color:#0a0909;align-items:center;justify-content:flex-start;width:860px;color:transparent;text-shadow:0 0 .01em #838088;font-family:"sans-serif",Arial;font-size:.8em}#top_section_wrapper #mentions_per_sentiment_graph #mentions_timeline_header span{padding-left:1em}#middle_section_wrapper{width:100%;height:230px;display:flex;flex-direction:row;justify-content:center;padding-bottom:.5em}#middle_section_wrapper #mentions_per_provider_wrapper{width:410px;height:auto;margin:.5em .5em .5em 2.5em;background-color:#000;border-right:1px solid #0a0909;border-bottom:1px solid #1b1b1b;box-shadow:0 0 15px 5px #000}#middle_section_wrapper #mentions_per_provider_wrapper #mentions_per_provider_header{display:flex;justify-content:flex-start;height:3em;box-shadow:inset 0 0 10px rgba(0,0,0,.8);border-top:1px solid #2f2f2f;border-left:1px solid #2f2f2f;border-bottom:1px solid #2f2f2f;background-color:#313131;align-items:center;color:#fff;font-family:"sans-serif",Arial;font-size:.85em}#middle_section_wrapper #mentions_per_provider_wrapper #mentions_per_provider_header span{padding-left:1em}#middle_section_wrapper #mentions_per_provider_wrapper #mentions_per_provider_graph{padding-top:.5em}#middle_section_wrapper #mentions_per_provider_wrapper #social_media0{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;background-color:#3b5998;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#middle_section_wrapper #mentions_per_provider_wrapper #social_media1{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;background-color:#fd1d1d;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#middle_section_wrapper #mentions_per_provider_wrapper #social_media2{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;background-color:#35465c;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#middle_section_wrapper #mentions_per_provider_wrapper #social_media3{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;background-color:#1da1f2;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#middle_section_wrapper #sentiment_wrapper{width:435px;height:215px;margin:.5em;box-shadow:0 0 15px 5px #000;border-left:1px solid #0a0909;background-color:#000}#middle_section_wrapper #sentiment_wrapper #sentiment_header{box-shadow:inset 0 -1px 10px rgba(0,0,0,.8);border-top:1px solid #2f2f2f;display:flex;height:3em;width:435px;background-color:#313131;align-items:center;justify-content:flex-start;color:#fff;font-family:"sans-serif",Arial;font-size:.85em}#middle_section_wrapper #sentiment_wrapper #sentiment_header span{padding-left:1em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper{width:100%;display:flex;height:170px;border-top:1px solid #2f2f2f;border-bottom:1px solid #1b1b1b;font-family:"sans-serif",Arial;color:#535154;font-size:.8em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div{height:70%;display:flex;align-content:center;align-items:center}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #plus{font-size:1.5em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #positive_sentiment_percentage{font-size:3em;font-family:"sans-serif",Arial;color:transparent;text-shadow:0 0 .02em #40e63d}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #positive_sentiment{font-size:1.1em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper #negative_borders{border-left:1px solid #1b1b1b;border-right:1px solid #1b1b1b}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper #negative_borders #minus{width:.5em;font-size:1.5em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper #negative_borders #negative_sentiment_percentage{font-size:3em;font-family:"sans-serif",Arial;color:transparent;text-shadow:0 0 .02em #c22137}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper #negative_borders #negative_sentiment{font-size:1.1em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #neutral_space{padding-top:.5em}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #neutral_sentiment_percentage{color:transparent;text-shadow:0 0 .02em #fff;font-size:3em;font-family:"sans-serif",Arial}#middle_section_wrapper #sentiment_wrapper #body_sentiment_wrapper div #neutral_sentiment{font-size:1.1em}#middle_section_wrapper #sentiment_timeline_graph{box-shadow:0 0 15px 5px #000;border-bottom:1px solid #1b1b1b;border-left:1px solid #0a0909;border-right:1px solid #0a0909;width:410px;height:214px;margin:.5em 2.5em .5em .25em;background-color:#000}#middle_section_wrapper #sentiment_timeline_graph #sentiment_timeline_header{box-shadow:inset 0 0 10px rgba(0,0,0,.8);border-top:1px solid #2f2f2f;border-right:1px solid #2f2f2f;border-bottom:1px solid #2f2f2f;display:flex;height:3em;background-color:#313131;align-items:center;justify-content:flex-start;color:#fff;font-family:"sans-serif",Arial;font-size:.85em}#middle_section_wrapper #sentiment_timeline_graph #sentiment_timeline_header span{padding-left:1em}#middle_section_wrapper #sentiment_timeline_graph #sentiment_timeline_body{padding-top:1.75em}#middle_section_wrapper #sentiment0{background-color:#40e63d}#middle_section_wrapper #sentiment0,#middle_section_wrapper #sentiment1{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#middle_section_wrapper #sentiment1{background:#c22137}#middle_section_wrapper #sentiment2{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;background-color:#fff;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}@media (max-width:900px){#bottom_section_wrapper{display:none}}#bottom_section_wrapper{position:relative;width:100%}#bottom_section_wrapper #date_container{position:absolute;z-index:21;padding-top:1.1em;left:calc(50% - 35pc)}#bottom_section_wrapper #date_container #date_select{color:#fff;background:#313131;width:15em;font-size:1em;border-radius:4px;font-family:"sans-serif",Arial}#bottom_section_wrapper #view_mentions{display:none;position:absolute;top:10px;left:calc(50% - 643px);width:1263px;box-shadow:inset 0 -1px 10px rgba(0,0,0,.8);border-top:1px solid #2f2f2f;height:3em;background-color:#313131;align-items:center;z-index:20;color:#fff;font-family:"sans-serif",Arial;font-size:.85em}#bottom_section_wrapper #view_mentions #view_mentions_padding{display:flex;width:100%;justify-content:center;padding-top:1em}#bottom_section_wrapper .select{position:relative;display:inline-block}#bottom_section_wrapper .select select{outline:0;-webkit-appearance:none;display:block;padding:.7em .5em .6em 4.4em;margin:0;transition:border-color .2s;box-shadow:inset 0 0 10px rgba(0,0,0,.8);border:1px solid #313131;border-radius:5px;background:#313131;color:#555;font-family:inherit;font-size:inherit;line-height:inherit}#bottom_section_wrapper .select .arr{background:transparent;bottom:5px;position:absolute;right:5px;top:5px;width:50px;pointer-events:none}#bottom_section_wrapper .select .arr:before{content:\'\';position:absolute;top:50%;right:15px;margin-top:-5px;pointer-events:none;border-top:10px solid #686a6c;border-left:10px solid transparent;border-right:10px solid transparent}#bottom_section_wrapper .select .arr:after{content:\'\';position:absolute;top:50%;right:15px;margin-top:-5px;pointer-events:none;border-top:6px solid #686a6c;border-left:6px solid transparent;border-right:6px solid transparent}#loading_overlay #loaded{position:absolute;width:100%;height:100%;z-index:9998;background:#1b1b1b}#loading_overlay #loading{position:absolute;z-index:9999;top:49%;right:calc(50% - 6.5em);color:#fff}#loading_overlay .load_content{display:none;text-align:center}#loading_overlay .spin_container{position:absolute;z-index:9999;top:45%;right:50%;color:#fff;font-size:1.5em}#page_content{display:none}#modal_overlay{position:absolute;width:100%;height:100%;z-index:9000}#modal{border-radius:25px;position:absolute;right:calc(50% - 642px);top:373px;width:500px;z-index:9999}#modal .modal_actor_container{background-color:#242627;border-radius:7px;color:#686a6c;width:auto;height:auto;box-shadow:0 0 15px 5px #000}#modal .modal_actor_container #modal_header{border-radius:7px 7px 0 0;box-shadow:inset 0 0 10px rgba(0,0,0,.8);display:flex;flex-direction:row;width:100%;align-items:center;background-color:#1b1a1d;border-bottom:1px solid #2e3031;margin:0;padding-bottom:5px}#modal .modal_actor_container #modal_header #actor_avatar{width:3em;height:3em;margin:0 10px 0 5px}#modal .modal_actor_container #modal_header #actor_avatar #actor_avator{width:3em;height:3em}#modal .modal_actor_container #modal_header div #actor_name{color:#fff;margin:0}#modal .modal_actor_container #modal_header div #actor_username{color:#686a6c;margin:0;font-size:.8em;font-family:"sans-serif",Arial}#modal .modal_actor_container #modal_header #like_dislike_shares{display:flex;justify-content:flex-end;width:auto;height:100%}#modal .modal_actor_container #modal_header #like_dislike_shares #mention_modal_like{color:#40e63d;border-left:1px solid #313131;width:auto;padding:0 .5em;cursor:pointer}#modal .modal_actor_container #modal_header #like_dislike_shares #mention_modal_dislike{color:#c22137;border-left:1px solid #313131;width:auto;padding:0 .5em;cursor:pointer}#modal .modal_actor_container #modal_header #like_dislike_shares #mention_modal_shares_wrapper{display:flex;justify-content:center;border-left:1px solid #313131;width:auto;padding:0 .5em}#modal .modal_actor_container #modal_body{background-color:#242625;border-top:1px solid #2e3031;border-bottom:2px solid #2e3031;box-shadow:inset 0 0 10px #2c2e2d;padding:0 1em 1em;color:#9596a1}#modal .modal_actor_container #modal_body #actor_url{color:#0d86bb}#modal .modal_actor_container #reply_modal{background-color:#1b1a1d;box-shadow:inset 0 0 10px rgba(0,0,0,.8)}#modal .modal_actor_container #reply_modal .reply_label{font-family:"sans-serif",Arial;font-size:.8em;margin-left:20px}#modal .modal_actor_container #reply_modal #reply_input{background-color:#1b1a1d;border-radius:5px;border:2px solid #1f2123;color:#fff;width:90%;height:4em;padding:15px 0 10px;text-decoration:none;outline:grey;resize:none;overflow:auto}#modal .modal_actor_container #reply_modal #cancel_reply{border-radius:5px;border:none;font-family:"sans-serif",Arial;color:#777778;font-size:15px;background:#363538;padding:10px 15px;text-decoration:none;margin-right:10px;outline:0}#modal .modal_actor_container #reply_modal #cancel_reply:hover{text-decoration:none}#modal .modal_actor_container #reply_modal #send_reply{background-color:#0d86bb;border-radius:5px;border:none;font-family:"sans-serif",Arial;color:#fff;font-size:15px;padding:0 15px;text-decoration:none;margin-right:20px;outline:0}#modal .modal_actor_container #reply_modal #send_reply:hover{text-decoration:none}#modal .modal_actor_container #modal_footer{border-radius:0 0 7px 7px;border-top:1px solid #343635;display:flex;flex-direction:row;width:100%;align-content:center;background-color:#242625;padding:8px 0 2px}#modal .modal_actor_container #modal_footer #provider{padding:5px}.visible{visibility:hidden}.hide_display{display:none}.show_display{display:block}', "" ]);
}, function(e, t) {
    e.exports = function() {
        var e = [];
        return e.toString = function() {
            for (var e = [], t = 0; t < this.length; t++) {
                var r = this[t];
                r[2] ? e.push("@media " + r[2] + "{" + r[1] + "}") : e.push(r[1]);
            }
            return e.join("");
        }, e.i = function(t, r) {
            "string" == typeof t && (t = [ [ null, t, "" ] ]);
            for (var n = {}, o = 0; o < this.length; o++) {
                var a = this[o][0];
                "number" == typeof a && (n[a] = !0);
            }
            for (o = 0; o < t.length; o++) {
                var i = t[o];
                "number" == typeof i[0] && n[i[0]] || (r && !i[2] ? i[2] = r : r && (i[2] = "(" + i[2] + ") and (" + r + ")"), 
                e.push(i));
            }
        }, e;
    };
}, function(e, t, r) {
    function n(e, t) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r], o = c[n.id];
            if (o) {
                o.refs++;
                for (var a = 0; a < o.parts.length; a++) o.parts[a](n.parts[a]);
                for (;a < n.parts.length; a++) o.parts.push(d(n.parts[a], t));
            } else {
                for (var i = [], a = 0; a < n.parts.length; a++) i.push(d(n.parts[a], t));
                c[n.id] = {
                    id: n.id,
                    refs: 1,
                    parts: i
                };
            }
        }
    }
    function o(e) {
        for (var t = [], r = {}, n = 0; n < e.length; n++) {
            var o = e[n], a = o[0], i = o[1], d = o[2], s = o[3], l = {
                css: i,
                media: d,
                sourceMap: s
            };
            r[a] ? r[a].parts.push(l) : t.push(r[a] = {
                id: a,
                parts: [ l ]
            });
        }
        return t;
    }
    function a() {
        var e = document.createElement("style"), t = _();
        return e.type = "text/css", t.appendChild(e), e;
    }
    function i() {
        var e = document.createElement("link"), t = _();
        return e.rel = "stylesheet", t.appendChild(e), e;
    }
    function d(e, t) {
        var r, n, o;
        if (t.singleton) {
            var d = g++;
            r = u || (u = a()), n = s.bind(null, r, d, !1), o = s.bind(null, r, d, !0);
        } else e.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (r = i(), 
        n = p.bind(null, r), o = function() {
            r.parentNode.removeChild(r), r.href && URL.revokeObjectURL(r.href);
        }) : (r = a(), n = l.bind(null, r), o = function() {
            r.parentNode.removeChild(r);
        });
        return n(e), function(t) {
            if (t) {
                if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
                n(e = t);
            } else o();
        };
    }
    function s(e, t, r, n) {
        var o = r ? "" : n.css;
        if (e.styleSheet) e.styleSheet.cssText = h(t, o); else {
            var a = document.createTextNode(o), i = e.childNodes;
            i[t] && e.removeChild(i[t]), i.length ? e.insertBefore(a, i[t]) : e.appendChild(a);
        }
    }
    function l(e, t) {
        var r = t.css, n = t.media;
        t.sourceMap;
        if (n && e.setAttribute("media", n), e.styleSheet) e.styleSheet.cssText = r; else {
            for (;e.firstChild; ) e.removeChild(e.firstChild);
            e.appendChild(document.createTextNode(r));
        }
    }
    function p(e, t) {
        var r = t.css, n = (t.media, t.sourceMap);
        n && (r += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(n)))) + " */");
        var o = new Blob([ r ], {
            type: "text/css"
        }), a = e.href;
        e.href = URL.createObjectURL(o), a && URL.revokeObjectURL(a);
    }
    var c = {}, m = function(e) {
        var t;
        return function() {
            return "undefined" == typeof t && (t = e.apply(this, arguments)), t;
        };
    }, f = m(function() {
        return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
    }), _ = m(function() {
        return document.head || document.getElementsByTagName("head")[0];
    }), u = null, g = 0;
    e.exports = function(e, t) {
        t = t || {}, "undefined" == typeof t.singleton && (t.singleton = f());
        var r = o(e);
        return n(r, t), function(e) {
            for (var a = [], i = 0; i < r.length; i++) {
                var d = r[i], s = c[d.id];
                s.refs--, a.push(s);
            }
            if (e) {
                var l = o(e);
                n(l, t);
            }
            for (var i = 0; i < a.length; i++) {
                var s = a[i];
                if (0 === s.refs) {
                    for (var p = 0; p < s.parts.length; p++) s.parts[p]();
                    delete c[s.id];
                }
            }
        };
    };
    var h = function() {
        var e = [];
        return function(t, r) {
            return e[t] = r, e.filter(Boolean).join("\n");
        };
    }();
}, function(e, t, r) {
    var n = r(2);
    "string" == typeof n && (n = [ [ e.id, n, "" ] ]);
    r(4)(n, {});
    n.locals && (e.exports = n.locals);
} ]);