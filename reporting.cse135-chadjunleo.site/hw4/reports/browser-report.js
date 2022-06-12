var chrome = [];
var firefox = [];
var safari = [];
var opera = [];
var edge = [];
var other = [];

window.addEventListener('DOMContentLoaded', getAll);

function getAll() {
    get(1);
    get(2);
}

function get(type) {
  let xhr = new XMLHttpRequest();

  if(type == 1) {
    
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/static');
  } else {
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/performance');
  }

  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(null);

  xhr.onload = function() {
    if(type == 1) {
      type = JSON.parse(xhr.response);
      browser_id(type);
    } else {
      type = JSON.parse(xhr.response);
      config1 = display_average(type, false);
      config2 = display_average(type, true);
      graph(config1, 'browser-load');
      graph(config2, 'browser-load-modify');
    } 
  }
}


function browser_id(data) {

  for(i = 0; i < data.length; i++) {
    let os = data[i].user_agent;

    if(os.match(/chrome|chromium|crios/i)){
      chrome.push(data[i].id);
    }else if(os.match(/firefox|fxios/i)){
      firefox.push(data[i].id);
    }  else if(os.match(/safari/i)){
      safari.push(data[i].id);
    }else if(os.match(/opr\//i)){
      opera.push(data[i].id);
    } else if(os.match(/edg/i)){
      edge.push(data[i].id);
    } else {
      other.push(data[i].id);
    }
  }
};


function display_average(data, isModified) {
  
  let chrome_list = [];
  let chrome_load = 0;
  let chrome_users = 0;

  let firefox_list = [];
  let firefox_load = 0;
  let firefox_users = 0;
  
  let safari_list = [];
  let safari_load = 0
  let safari_users = 0;

  let opera_list = [];
  let opera_load = 0;
  let opera_users = 0;

  let edge_list = [];
  let edge_load = 0;
  let edge_users = 0;

  let other_list = [];
  let other_load = 0;
  let other_users = 0;

  // Iterate over all data in DB
  for(let i = 0; i < data.length; i++) {
    let load_time = data[i].total_load_time;
    let load_id = data[i].id;
    
    if (chrome.indexOf(load_id) != -1) {
        if (isModified == false || load_time < 5000) {
            chrome_list.push(load_time);
            chrome_load = chrome_load + load_time;
            chrome_users++;
        }

    } else if (firefox.indexOf(load_id) != -1) {

        if (isModified == false || load_time < 5000) {
            firefox_list.push(load_time);
            firefox_load = firefox_load + load_time;
            firefox_users++;
        }

    } else if (safari.indexOf(load_id) != -1) {
        if (isModified == false || load_time < 5000) {
            safari_list.push(load_time);
            safari_load = safari_load + load_time;
            safari_users++;
        }

    } else if (opera.indexOf(load_id) != -1) {

        if (isModified == false || load_time < 5000) {
            opera_list.push(load_time);
            opera_load = opera_load + load_time;
            opera_users++;
        }

    } else if (edge.indexOf(load_id) != -1) {

        if (isModified == false || load_time < 5000) {
            edge_list.push(load_time);
            edge_load = edge_load + load_time;
            edge_users++;
        }

    } else if (other.indexOf(load_id) != -1){
        if (isModified == false || load_time < 5000) {
            other_list.push(load_time);
            other_load = other_load + load_time;
            other_users++;
        }
    }
  }

  let chrome_average = null;
  let firefox_average = null;
  let safari_average = null;
  let opera_average = null;
  let edge_average = null;
  let other_average = null;
  
  if (chrome_users != 0) {
    chrome_average = (chrome_load / chrome_users).toFixed(2)-0;
  }
  if (firefox_users != 0) {
    firefox_average = (firefox_load / firefox_users).toFixed(2)-0;
  }
  if (safari_users != 0) {
    safari_average = (safari_load / safari_users).toFixed(2)-0;
  }
  if (opera_users != 0) {
    opera_average = (opera_load / opera_users).toFixed(2)-0;
  }
  if (edge_users != 0) {
    edge_average = (edge_load / edge_users).toFixed(2)-0;
  }
  if (other_users != 0) {
    other_average = (other_load / other_users).toFixed(2)-0;
  }

  let grid_data = [
    {
      "Browser": "Chrome",
      "average time": chrome_average,
      "time list" : chrome_list.sort(function(a, b){return a - b})
    },
    {
      "Browser": "Firefox",
      "average time": firefox_average,
      "time list" : firefox_list.sort(function(a, b){return a - b})
    },
    {
      "Browser": "Safari",
      "average time": safari_average,
      "time list" : safari_list.sort(function(a, b){return a - b})
    },
    {
      "Browser": "Opera",
      "average time": opera_average,
      "time list" : opera_list.sort(function(a, b){return a - b})
    },
    {
      "Browser": "Edge",
      "average time": edge_average,
      "time list" : edge_list.sort(function(a, b){return a - b})
    },
    {
        "Browser": "Other",
      "average time": other_average,
      "time list" : other_list.sort(function(a, b){return a - b})
    }
  ];

  if (isModified == false) {
    document.getElementById("browser-grid").data = grid_data;
  } else {
    document.getElementById("browser-grid-modify").data = grid_data; 
  }

  let chart_title = "Average load time for browsers";

  if (isModified == true) {
     chart_title = "Average load time for browsers (eliminate outlier)";
  }

  let config = {
    'type': 'bar',
    'title': {
      'text': chart_title
    },
    'scale-x': {
      'labels': [ 'chrome', 'firefox', 'safari', 'opera', 'edge', 'other' ],
      'label': {
        'text': 'Browser'
      }
    },
    'scale-y': {
      'label': {
        'text': 'Average loading time'
      }
    },
    'plot': {
      'value-box': {

      },
      'animation': {
          'effect': 4,
          'method': 3
      },
      'tooltip': {
        'text': "%t %kl: %v."
      }
    },
    'series': [
      {
        'values': [chrome_average, firefox_average, safari_average, opera_average, edge_average, other_average],
        'background-color': 'green'
      }
    ]
  }

  return config;
};



function graph(config, strid) {
  zingchart.render({
    id: strid,
    data: config,
    height: 400,
    width: "100%",
  });
}