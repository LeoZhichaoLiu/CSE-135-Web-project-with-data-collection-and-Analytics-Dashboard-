const LINEDATA = 0;
const BARDATA = 1;
const PIEDATA = 2;


window.addEventListener('DOMContentLoaded', getAll);


function getAll() {
  get(PIEDATA);
  get(LINEDATA);
  get(BARDATA);
}

function get(type) {
  let xhr = new XMLHttpRequest();

  if(type == 2) {
    // Get os info
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/static');
  } else if(type == 0) {

    // Get click types. This will be graphed on a line graph. Where x axis is
    // day of week, and y axix will be number of clicks (right, left, center)
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/activity/mouse_click');
  } else {
    // Get info regarding image, css, js
    xhr.open('GET', 'https://collector.cse135-chadjunleo.site/api/static');
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
    } else {
      type = JSON.parse(xhr.response);
      let enableConfig = configEnable(type);
      graph(enableConfig, 'series2Bar');
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
        'text': 'Operating Systems'
      },
      'toggle-action': 'remove',
      'draggable': true
    },
    'title': {
      'text': 'Operating Systems Used to Visit Site',
      'width': 500,
      'height': 30,
      'background-color': 'gray',
      'color': '#FFF',
      'border-radius': '30px'
    },
    'plot': {
      'animation': {
        'on-legend-toggle': true,
        'effect': '3',
        'method': '1',
        'sequence': '1'
      },
      'tooltip': {
        'text': '%t users: %v'
      }
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
      }
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

function graph(config, strid) {
  zingchart.render({
    id: strid,
    data: config,
    height: 400,
    width: "100%",
  });
}