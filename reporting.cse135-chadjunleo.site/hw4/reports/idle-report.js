window.addEventListener('DOMContentLoaded', loadHandler());

function loadHandler() {
  const unloadRequest = new XMLHttpRequest();
  
  unloadRequest.addEventListener('load', (e) => {
    
    const unloadData = JSON.parse(unloadRequest.response);
    
    const idleRequest = new XMLHttpRequest();
    
    idleRequest.addEventListener('load', (e) => {
      const idleData = JSON.parse(idleRequest.response);
      
      handleData(unloadData, idleData);
    });
    idleRequest.open('GET', 'https://collector.cse135-chadjunleo.site/api/activity/idle');
  
    idleRequest.send();
  });
  
  unloadRequest.open('GET', 'https://collector.cse135-chadjunleo.site/api/activity/unload');
  
  unloadRequest.send();
}

function handleData(unloadData, idleData) {
  const idleTimeData = {};
  unloadData.forEach (unloadElement => {
    const idleTimeElement = {};
    idleTimeElement.seconds_spent_on_site = -1;
    if (unloadElement.activity_timestamp !== -1 && unloadElement.unload_timestamp !== -1) {
      idleTimeElement.seconds_spent_on_site = (unloadElement.unload_timestamp - unloadElement.activity_timestamp)/1000.0;
      idleTimeElement.idle_total_time_idle = 0.0;
      if(!idleTimeData[unloadElement.session_id]) {
        idleData.forEach(idleElement => {
          if (unloadElement['session_id'] == idleElement['session_id']) 
            idleTimeElement.idle_total_time_idle += (idleElement.idle_time/1000.0) + 2.0;
        });
        idleTimeData[unloadElement.session_id] = idleTimeElement;
      } else {
        idleTimeData[unloadElement.session_id].seconds_spent_on_site += idleTimeElement.seconds_spent_on_site;
      }
    }
  });
  
  // Setup data object for the table
  const tableData = [];
  
  // Setup data object for the pie chart
  const pieData = {};
  pieData.active = 0.0;
  pieData.idle = 0.0;

  // Setup data object for the bar chart
  const barChartData = [];
  
  
  for(const property in idleTimeData) {
    // Create data for the grid
    const gridItem = {};
    gridItem.session_id = property;
    gridItem.seconds_spent_on_site_total = idleTimeData[property].seconds_spent_on_site;
    gridItem.seconds_spend_on_site_active = idleTimeData[property].seconds_spent_on_site - idleTimeData[property].idle_total_time_idle;
    gridItem.seconds_spend_on_site_idle = idleTimeData[property].idle_total_time_idle;
    gridItem.percentage_of_time_idle = idleTimeData[property].idle_total_time_idle/idleTimeData[property].seconds_spent_on_site * 100;
    tableData.push(gridItem);
    
    // Add data to pie
    pieData.active += idleTimeData[property].seconds_spent_on_site - idleTimeData[property].idle_total_time_idle;
    pieData.idle += idleTimeData[property].idle_total_time_idle;
    
    // Add data to graph
    gridItem.seconds_spent_on_site_total = idleTimeData[property].seconds_spent_on_site;
    gridItem.seconds_spend_on_site_active = idleTimeData[property].seconds_spent_on_site - idleTimeData[property].idle_total_time_idle;
    gridItem.seconds_spend_on_site_idle = idleTimeData[property].idle_total_time_idle;
    barChartData.push(gridItem);
  }
  
  document.querySelector('#load-grid').data = tableData;
  
  const barConfig = configBar(barChartData);
  graph(barConfig, 'timeGraph');
  
  const pieConfig = configPieData(pieData);
  graph(pieConfig, 'idleRatio');
}

function configPieData(data) {
  return {
    'type': 'pie',
    'legend': {
      'header': {
        'text': 'Active Time vs Idle Time Spent on Website'
      },
    },
    'title': {
      'text': 'Active Time vs Idle Time Spent on Website',
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
        'text': '%t Seconds Spent on Website: %v'
      }
    },
    'series': [
      {
        'values': [data.active],
        'background-color': '#4fa64f',
        'text': 'Active Time'
      },
      {
        'values': [data.idle],
        'background-color': "#c70000",
        'text': 'Idle Time'
      }
    ]
  }
}

function configBar(data) {
  
  const totalTimeCounts = [0, 0, 0, 0, 0, 0, 0];
  const activeTimeCounts = [0, 0, 0, 0, 0, 0, 0];
  const idleTimeCounts = [0, 0, 0, 0, 0, 0, 0];
  
  for(let i = 0; i < data.length; i++) {
    
    let totalTime = data[i].seconds_spent_on_site_total;
    let activeTime = data[i].seconds_spend_on_site_active;
    let idleTime = data[i].seconds_spend_on_site_idle;
    
    if (totalTime < 1) {
      totalTimeCounts[0]++;
    } else if (totalTime < 10) {
      totalTimeCounts[1]++;
    } else if (totalTime < 60) {
      totalTimeCounts[2]++;
    } else if (totalTime < 120) {
      totalTimeCounts[3]++;
    } else if (totalTime < 300) {
      totalTimeCounts[4]++;
    } else if (totalTime < 600) {
      totalTimeCounts[5]++;
    } else {
      totalTimeCounts[6]++;
    }
    
    if (activeTime < 1) {
      activeTimeCounts[0]++;
    } else if (activeTime < 10) {
      activeTimeCounts[1]++;
    } else if (activeTime < 60) {
      activeTimeCounts[2]++;
    } else if (activeTime < 120) {
      activeTimeCounts[3]++;
    } else if (activeTime < 300) {
      activeTimeCounts[4]++;
    } else if (activeTime < 600) {
      activeTimeCounts[5]++;
    } else {
      activeTimeCounts[6]++;
    }
    if(idleTime === 0) {
      // Do nothing
    } else if (idleTime < 1) {
      idleTimeCounts[0]++;
    } else if (idleTime < 10) {
      idleTimeCounts[1]++;
    } else if (idleTime < 60) {
      idleTimeCounts[2]++;
    } else if (idleTime < 120) {
      idleTimeCounts[3]++;
    } else if (idleTime < 300) {
      idleTimeCounts[4]++;
    } else if (idleTime < 600) {
      idleTimeCounts[5]++;
    } else {
      idleTimeCounts[6]++;
    }
  }
  
  return {
    'type': 'bar',
    'title': {
      'text': 'Count of Users Who Spent Their Time Active/Idle/Combined on the Website'
    },
    'legend': {
      'header': {
        'text': 'User Spent Their Time:'
      },
      'toggle-action': 'remove',
    },
    'scale-x': {
      'labels': [ '0-1', '1-10', '10-60', '60-120', '120-300', '300-600', '>600' ],
      'label': {
        'text': 'Time Spent on Website (Seconds)'
      }
    },
    'scale-y': {
      'label': {
        'text': 'Users  '
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
        'text': "Users who spent %kl seconds %t: %v."
      }
    },
    'series': [
      {
        'values': [totalTimeCounts[0], totalTimeCounts[1], totalTimeCounts[2], 
          totalTimeCounts[3], totalTimeCounts[4], totalTimeCounts[5], 
          totalTimeCounts[6]],
        'background-color': 'blue',
        'text': 'Combined'
      },
      {
        'values': [activeTimeCounts[0], activeTimeCounts[1], activeTimeCounts[2], 
          activeTimeCounts[3], activeTimeCounts[4], activeTimeCounts[5], 
          activeTimeCounts[6]],
        'background-color': 'green',
        'text': 'Active'
      },
      {
        'values': [idleTimeCounts[0], idleTimeCounts[1], idleTimeCounts[2], 
          idleTimeCounts[3], idleTimeCounts[4], idleTimeCounts[5], 
          idleTimeCounts[6]],
        'background-color': 'red',
        'text': 'Idle'
      }
    ]
  }
}

function graph(config, strid) {
  zingchart.render({
    id: strid,
    data: config,
    height: 400,
    width: "100%",
  });
}