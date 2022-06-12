const LINEDATA = 0;
const BARDATA = 1;
const PIEDATA = 2;
const TOTAL_USER = 3;
const BROWSER = 4;
const LOAD_TIME = 5;

window.addEventListener('DOMContentLoaded', loadAllCharts);

window.addEventListener('DOMContentLoaded', loadGridData)

function loadAllCharts() {
  loadChart(PIEDATA);
  loadChart(LINEDATA);
  loadChart(BARDATA);
  loadChart(TOTAL_USER);
  loadChart(BROWSER);
  loadChart(LOAD_TIME);
}

function loadGridData() {
  
  let unloadRequest = new XMLHttpRequest();
  
  unloadRequest.addEventListener('load', (e) => {
    
    setupLoadData(JSON.parse(unloadRequest.response));
  });
  
  unloadRequest.open('GET', 'https://collector.cse135-chadjunleo.site/api/activity/unload');
  
  unloadRequest.send();
}

function setupLoadData(unloadData) {
  let data = unloadData;
  for (let element of data) {
    element.date_entered = "null";
    element.date_left = "null";
    if(element.activity_timestamp !== -1) {
      element.date_entered = new Date(element.activity_timestamp);
    }
    if(element.unload_timestamp !== -1) {
      element.date_left = new Date(element.unload_timestamp);
    }
    element.seconds_spent_on_site = -1;
    if (element.activity_timestamp !== -1 && element.unload_timestamp !== -1) {
      element.seconds_spent_on_site = (element.unload_timestamp - element.activity_timestamp)/1000.0;
    }
    delete element.activity_timestamp;
    delete element.unload_timestamp;
    delete element.id;
  }
  document.querySelector('#load-grid').data = data;
}

function loadChart(type) {
  let xhr = new XMLHttpRequest();

  if(type == 2) {
    // Get os info
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/static');
  } else if(type == 0) {
    // Get click types. This will be graphed on a line graph. Where x axis is
    // day of week, and y axix will be number of clicks (right, left, center)
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/activity/mouse_click');
  } else if (type == 1 || type == 2 || type == 3 || type == 4) {
    // Get info regarding image, css, js
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/static');
  } else if (type == 5) {
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/performance');
  }

  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(null);

  xhr.onload = function() {
    if(type == PIEDATA) {
      type = JSON.parse(xhr.response);
      let osConfig = configOs(type);
      graph(osConfig, 'pie');
    } else if(type == LINEDATA) {
      type = JSON.parse(xhr.response);
      let mouseConfig = configMouse(type);
      graph(mouseConfig, 'series3Line');
    } else if (type == BARDATA) {
      type = JSON.parse(xhr.response);
      let enableConfig = configEnable(type);
      graph(enableConfig, 'series2Bar');
    } else if (type == TOTAL_USER) {
      type = JSON.parse(xhr.response);
      let total_user = type.length;
      let today_user = 0;
      let week_user = 0
      let today = new Date();
      for (let i = 0; i < type.length; i++) {
        let date = new Date(type[i].timestamp);
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        //console.log(month);
        if (year == today.getFullYear() && month == today.getMonth() && day == today.getDate()) {
            today_user++;
        }
        if (today.getDate() >= 7) {
            if (year == today.getFullYear() && month == today.getMonth() && (day <= today.getDate() && day >= (today.getDate()-7))) {
                week_user++;
            }
        } else {
            if (year == today.getFullYear() && month == today.getMonth() && day <= today.getDate()) {
                week_user++;
            } else if (year == today.getFullYear() && month == today.getMonth()-1 && day >= (24+today.getDate())) {
                week_user++;
            }
        }
      }aspect: "segmented"
      document.getElementById("users-num3").textContent = total_user;
      document.getElementById("users-num2").textContent = week_user;
      document.getElementById("users-num1").textContent = today_user;

    } else if (type == 5) {
      type = JSON.parse(xhr.response);
      let loadConfig = configLoad(type);
      graph(loadConfig, 'load');

    } else if (type = BROWSER) {
      type = JSON.parse(xhr.response);
      let BrowserConfig = configBrowser(type);
      graph(BrowserConfig, 'browser');
    } 
  }
}


function configOs(data) {

  let mac = 0;
  let windows = 0;
  let linux = 0;

  for(i = 0; i < data.length; i++) {
    let os = data[i].user_agent;

    if(os.includes('Windows')) {
      windows++;
    } else if(os.includes('Macintosh')) {
      mac++;
    } else if(os.includes('Linux')) {
      linux++;
    } 
  }

  let config = {
    'type': 'pie',
    'legend': {
      'header': {
        'text': 'Operating Systems',
        'font-family': 'Georgia',
        'font-weight': 'normal'
      },
      'toggle-action': 'remove',
      'draggable': true
    },
    'title': {
      'text': 'Operating Systems Used to Visit Site',
      'font-family': 'Georgia',
      'width': 500,
      'height': 25,
    },
    'plot': {
      'value-box': {
        'font-size': 20,
        'text': '%t\n%npv%',
        'font-family': 'georgia',
        'font-weight': 'normal',
        'placement': 'out',
      },
      'animation': {
        'on-legend-toggle': true,
        'effect': '3',
        'method': '1',
        'sequence': '1'
      },
      'tooltip': {
        'text': '%t users: %v (%npv%)',
        'font-family': 'georgia',
        'font-size': '25',
      },
    },
    'series': [
      {
        'values': [windows],
        'background-color': '#00a4ef',
        'text': 'Windows'
      },
      {
        'values': [mac],
        'background-color': "gray",
        'text': 'Macintosh'
      },
      {
        'values': [linux],
        'background-color': "orange",
        'text': 'Linux'
      }
    ]
  }

  return config;
};

function configMouse(data) {
  let hash1 = new Map();
  let hash2 = new Map();
  let hash3 = new Map();

  for(let i = 0; i < data.length; i++) {
    let date = new Date(data[i].mouse_click_timestamp);
    let day = date.getUTCDay();
    let buttonType = data[i].button;

    if(buttonType == 1) {
      if(hash1.has(day) == false) {
        hash1.set(day, 1);
      } else {
        let val = hash1.get(day);
        val++;
        hash1.set(day, val);
      }
    } else if(buttonType == 2) {
      if(hash2.has(day) == false) {
        hash2.set(day, 1);
      } else {
        let val = hash2.get(day);
        val++;
        hash2.set(day, val);
      }
    } else {
      if(hash3.has(day) == false) {
        hash3.set(day, 1);
      } else {
        let val = hash3.get(day);
        val++;
        hash3.set(day, val);
      }
    }
  }

  let sun1 = hash1.get(0);
  let mon1 = hash1.get(1);
  let tues1 = hash1.get(2);
  let wed1 = hash1.get(3);
  let thur1 = hash1.get(4);
  let fri1 = hash1.get(5);
  let sat1 = hash1.get(6);

  let sun2 = hash2.get(0);
  let mon2 = hash2.get(1);
  let tues2 = hash2.get(2);
  let wed2 = hash2.get(3);
  let thur2 = hash2.get(4);
  let fri2 = hash2.get(5);
  let sat2 = hash2.get(6);
  
  let sun3 = hash3.get(0);
  let mon3 = hash3.get(1);
  let tues3 = hash3.get(2);
  let wed3 = hash3.get(3);
  let thur3 = hash3.get(4);
  let fri3 = hash3.get(5);
  let sat3 = hash3.get(6);


  let config = {
    'type': 'line',
    'title': {
      'text': 'Number of Clicks throughout the Week'
    },
    'scale-x': {
      'labels': [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
      'label': {
        'text': 'Day of Week'
      }
    },
    'scale-y': {
      'label': {
        'text': 'Number of Instances Found'
      }
    },
    'legend': {
      'layout': '1x3',
      'header': {
        'text': 'Click Types',
        'align': 'center'
      },
      'draggable': true
    },
    'crosshair-x': {
      'plot-label': {
        'text': "Total of %v %t.",
        'multiple': true, 
      },
      'line-color': "red",
      'line-width': 2
    },
    'plot': {
      'animation': {
          'effect': 4,
          'method': 6
      },
      'aspect': 'stepped'
    },
    'series': [
      {
        'values': [sun1, mon1, tues1, wed1, thur1, fri1, sat1],
        'text': 'Left Clicks'
      },
      { 
        'values': [sun2, mon2, tues2, wed2, thur2, fri2, sat2],
        'text': 'Middle Clicks'
      },
      {
        'values': [sun3, mon3, tues3, wed3, thur3, fri3, sat3],
        'text': 'Right Clicks'
      }
    ]
  }

  return config;
}

function configEnable(data) {

  let cookies = 0;
  let noCookies = 0;
  let js = 0
  let noJs = 0;
  let css = 0;
  let noCss = 0;
  let img = 0;
  let noImg = 0;

  // Iterate over all data in DB
  for(let i = 0; i < data.length; i++) {
    // Check if cookies allowed
    if(data[i].accept_cookies == 1) {
      cookies++;
    } else {
      noCookies++;
    }

    // Check if css allowed
    if(data[i].allow_css == 1) {
      css++;
    } else {
      noCss++;
    }

    // Check if img allowed
    if(data[i].allow_images == 1) {
      img++;
    } else {
      noImg++;
    }

    // Check if js allowed
    if(data[i].allow_js == 1) {
      js++;
    } else {
      noJs++;
    }
  }

  let config = {
    'type': 'bar',
    'title': {
      'text': 'CSS/JS/Cookies/Img Settings per Visit'
    },
    'scale-x': {
      'labels': [ 'Cookies', 'CSS', 'Image', 'JavaScript' ],
      'label': {
        'text': 'Technology'
      }
    },
    'legend': {
      'header': {
        'text': 'Settings',
      },
      'draggable': true
    },
    'scale-y': {
      'values': "2:130",
      'label': {
        'text': 'Number of Instances Found'
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
        'values': [cookies, css, img, js],
        'background-color': 'green',
        'text': 'Enabled'
      },
      {
        'values': [noCookies, noCss, noImg, noJs],
        'background-color': 'red',
        'text': 'Disabled'
      }
    ]
  }
  return config;
}

function configBrowser(data) {

  let chrome = 0;
  let firefox = 0;
  let safari = 0;
  let opera = 0;
  let edge = 0;
  let other = 0;

  for(i = 0; i < data.length; i++) {
    let os = data[i].user_agent;

    if(os.match(/chrome|chromium|crios/i)){
      chrome++;
    }else if(os.match(/firefox|fxios/i)){
      firefox++;
    }  else if(os.match(/safari/i)){
      safari++;
    }else if(os.match(/opr\//i)){
      opera++;
    } else if(os.match(/edg/i)){
      edge++;
    }else{
      other++;
    }
  }


  let config = {
    'type': 'pie',
    'legend': {
      'header': {
        'text': 'Browser type'
      },
      'toggle-action': 'remove',
      'draggable': true
    },
    'title': {
      'text': 'Browser type Used to Visit Site',
      'width': 500,
      'height': 30,
      'background-color': 'gray',
      'color': '#FFF',
      'border-radius': '30px'
    },
    'plot': {
      'value-box': {
        'font-size': 20,
        'text': '%t\n%npv%',
        'font-family': 'georgia',
        'font-weight': 'normal',
        'placement': 'out',
      },
      'animation': {
        'on-legend-toggle': true,
        'effect': '3',
        'method': '1',
        'sequence': '1'
      },
      'tooltip': {
        'text': '%t users: %v',
        'font-family': 'georgia',
        'font-size': '25',
      }
    },
    'series': [
      {
        'values': [chrome],
        'background-color': '#CCCC00',
        'text': 'chrome'
      },
      {
        'values': [firefox],
        'background-color': "#CC00CC",
        'text': 'firefox'
      },
      {
        'values': [safari],
        'background-color': "#00a4ef",
        'text': 'safari'
      },
      {
        'values': [opera],
        'background-color': "#FF0000",
        'text': 'opera'
      },
      {
        'values': [edge],
        'background-color': "#333FFF",
        'text': 'edge'
      },
      {
        'values': [other],
        'background-color': "black",
        'text': 'other'
      }
    ]
  }

  return config;
};


function configLoad(data) {

  let level_1= 0;
  let level_2 = 0;
  let level_3 = 0
  let level_4 = 0;
  let level_5 = 0;
  let level_6 = 0;
  let level_7 = 0;
  let level_8 = 0;
  let level_9 = 0;
  let level_10 = 0;

  // Iterate over all data in DB
  for(let i = 0; i < data.length; i++) {
    let load_time = data[i].total_load_time;
    
    if (load_time < 50) {
      level_1++;
    } else if (load_time < 100) {
      level_2++;
    } else if (load_time < 200) {
      level_3++;
    } else if (load_time < 300) {
      level_4++;
    } else if (load_time < 400) {
      level_5++;
    } else if (load_time < 500) {
      level_6++;
    } else if (load_time < 1000) {
      level_7++;
    } else if (load_time < 5000) {
      level_8++;
    } else if (load_time < 10000) {
      level_9++;
    } else {
      level_10++;
    }
  }

  let config1 = {
    'type': 'bar',
    'title': {
      'text': 'Total Load Time for Users'
    },
    'scale-x': {
      'labels': [ '0-50', '50-100', '100-200', '200-300', '300-400', '400-500', '500-1000', '1000~5000', '5000-10000', '>10000' ],
      'label': {
        'text': 'Loading Time (units: ms)'
      }
    },
    'scale-y': {
      'label': {
        'text': 'Number of load time for users'
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
        'values': [level_1, level_2, level_3, level_4, level_5, level_6, level_7, level_8, level_9, level_10],
        'background-color': 'green'
      }
    ]
  }
  return config1;
};

function graph(config, strid) {
  zingchart.render({
    id: strid,
    data: config,
    height: 400,
    width: "100%",
  });
}