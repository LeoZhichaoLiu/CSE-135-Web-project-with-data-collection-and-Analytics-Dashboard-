window.addEventListener('DOMContentLoaded', getDatas);

let screenSize = [];
let loadTime = [];
let screenSizeTimestamp = [];
let loadTimestamp = [];

function getDatas() {
  getData(1);
  getData(2);
}

function getData(type) {
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
      getScreenSize(xhr.response);
    } else {
      getLoadTime(xhr.response);
      let map = new Map();
      fillMap(map, screenSize, loadTime, screenSizeTimestamp, loadTimestamp);
      createGrid(map);
      let data = createOptimized(map);
      let chartdata = createGraph(data);
      graph(chartdata);
    }
  }
}

function graph(chartdata) {
  zingchart.render({
    id: "screen-size-graph",
    data: chartdata,
    height: 400,
    width: "100%",
  });
}

function createGraph(data) {
  let config = {
    'type': 'bar',
    'title': {
      'text': 'Screen Resolutions and their Average Speeds'
    },
    'scale-x': {
      'labels': [ '2560 x 1440', '1920 x 1080', '1440 x 900', '834 x 1194', '360 x 760'],
      'label': {
        'text': 'Screen Sizes'
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
        'decimals': 0,
        'values': [data[0]["Average Load Time"], data[1]["Average Load Time"], data[2]["Average Load Time"], data[3]["Average Load Time"], data[4]["Average Load Time"]],
        'background-color': '#00629B'
      }
    ]
  }

  return config;
}

function createOptimized(map) {
  let graph = [];

  map.forEach((value, key) => {
    let averageLoadTime = 0;
    let loadTimes = 0;
    if(key == '2560 x 1440') {
      let size = 0;
      let filteredArr = []
      for(let i = 0; i < value.length; i++) {
        if(value[i] < 6000) {
          size++;
          averageLoadTime += value[i];
          filteredArr.push(value[i]);
        }
      }
      averageLoadTime = averageLoadTime / size;
      filteredArr = filteredArr.sort(function(a, b) {
        return a - b;
      });

      loadTimes = filteredArr;
    } else if(key == '1920 x 1080' || key == '1440 x 900') {
      let size = 0;
      let filteredArr = []
      for(let i = 0; i < value.length; i++) {
        if(value[i] < 10000) {
          size++;
          averageLoadTime += value[i];
          filteredArr.push(value[i]);
        }
      }
      averageLoadTime = averageLoadTime / size;
      filteredArr = filteredArr.sort(function(a, b) {
        return a - b;
      });

      loadTimes = filteredArr;
    } else {
      averageLoadTime = value.reduce((sum, a) => sum + a, 0);
      averageLoadTime = averageLoadTime / value.length;
      loadTimes = value.sort(function(a, b) {
        return a - b;
      });
    }

    let obj = {
      'Screen Size': key,
      'Average Load Time': averageLoadTime,
      'Load Times': loadTimes
    };
    graph.push(obj);
  });
  
  document.getElementById('screensize-loadtimes-filtered').data = graph;
  return graph;
}

function createGrid(map) {
  let graph = [];

  map.forEach((value, key) => {

    let averageLoadTime = value.reduce((sum, a) => sum + a, 0);
    averageLoadTime = averageLoadTime / value.length;
    let loadTimes = value.sort(function(a, b) {
      return a - b;
    })
    let obj = {
      "Screen Size": key,
      "Average Load Time": averageLoadTime,
      "Load Times": loadTimes
    };
    graph.push(obj);
  });
  
  document.getElementById('screensize-loadtimes').data = graph;
}

function fillMap(map, screenSize, loadTime, screenSizeTimestamp, loadTimestamp) {
  let length = Math.min(screenSizeTimestamp.length, loadTimestamp.length);

  for(let i = 0; i < length; i++) {
    if(screenSizeTimestamp[i] == loadTimestamp[i] && loadTime[i] != -1) {
      if(map.has(screenSize[i]) == false) {
        map.set(screenSize[i], [loadTime[i]]);
      } else {
        let arr = map.get(screenSize[i]);
        arr.push(loadTime[i]);
        map.set(screenSize[i], arr);
      }
    }
  }
}

function getScreenSize(result) {
  let data = JSON.parse(result);
  data.sort((a, b) => b.timestamp - a.timestamp);

  for(let i = 0; i < data.length; i++) {
    screenSize.push(`${data[i].window_size_x} x ${data[i].window_size_y}`);
    screenSizeTimestamp.push(data[i].timestamp);
  }
}

function getLoadTime(result) {
  let data = JSON.parse(result);
  data.sort((a, b) => b.timestamp - a.timestamp);

  for(let i = 0; i < data.length; i++) {
    loadTime.push(data[i].total_load_time);
    loadTimestamp.push(data[i].timestamp);
  }
}

