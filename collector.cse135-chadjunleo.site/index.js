const express = require('express');
const expressApp = express();
const mySqlApp = require('mysql');
const corsApp = require('cors');

expressApp.use([express.json(), corsApp()]);

// Login Constants
const HOST = '127.0.0.1';
const USERNAME = 'restapi';
const PASSWORD = 'gkMshwDJ4!';
const DATABASE = 'analytics';

let connectionPool = null;

////////////
// STATIC //
////////////
expressApp.get('/static', (req, res) => {getAllAnalytics(req, res, 'static')});
expressApp.get('/static/:id', (req, res) => {getAnalytics(req, res, 'static')});
expressApp.post('/static', (req, res) => {postAnalytics(req, res, 'static')});
expressApp.put('/static/:id', (req, res) => {putAnalytics(req, res, 'static')});
expressApp.delete('/static/:id', (req, res) => {deleteAnalytics(req, res, 'static')});

/////////////////
// PERFORMANCE //
/////////////////
expressApp.get('/performance', (req, res) => {getAllAnalytics(req, res, 'performance')});
expressApp.get('/performance/:id', (req, res) => {getAnalytics(req, res, 'performance')});
expressApp.post('/performance', (req,res) => {postAnalytics(req, res, 'performance')});
expressApp.put('/performance/:id', (req, res) => {putAnalytics(req, res, 'performance')});
expressApp.delete('/performance/:id', (req, res) => {deleteAnalytics(req, res, 'performance')});

//////////////
// ACTIVITY //
//////////////
// Activity Load API
expressApp.get('/activity/load/', (req, res) => {getAllAnalytics(req, res, 'load')});
expressApp.get('/activity/load/:id', (req, res) => {getAnalytics(req, res, 'load')});
expressApp.post('/activity/load/', (req, res) => {postAnalytics(req, res, 'load')});
expressApp.put('/activity/load/:id', (req, res) => {putAnalytics(req, res, 'load')});
expressApp.delete('/activity/load/:id', (req, res) => {deleteAnalytics(req, res, 'load')});

// Activity Unload API
expressApp.get('/activity/unload/', (req, res) => {getAllAnalytics(req, res, 'unload')});
expressApp.get('/activity/unload/:id', (req, res) => {getAnalytics(req, res, 'unload')});
expressApp.post('/activity/unload/', (req, res) => {postAnalytics(req, res, 'unload')});
expressApp.put('/activity/unload/:id', (req, res) => {putAnalytics(req, res, 'unload')});
expressApp.delete('/activity/unload/:id', (req, res) => {deleteAnalytics(req, res, 'unload')});

// Activity Mouse Movement API
expressApp.get('/activity/mouse_movement/', (req, res) => {getAllAnalytics(req, res, 'mouse_movement')});
expressApp.get('/activity/mouse_movement/:id', (req, res) => {getAnalytics(req, res, 'mouse_movement')});
expressApp.post('/activity/mouse_movement/', (req, res) => {postAnalytics(req, res, 'mouse_movement')});
expressApp.put('/activity/mouse_movement/:id', (req, res) => {putAnalytics(req, res, 'mouse_movement')});
expressApp.delete('/activity/mouse_movement/:id', (req, res) => {deleteAnalytics(req, res, 'mouse_movement')});

// Activity Mouse Click API
expressApp.get('/activity/mouse_click/', (req, res) => {getAllAnalytics(req, res, 'mouse_click')});
expressApp.get('/activity/mouse_click/:id', (req, res) => {getAnalytics(req, res, 'mouse_click')});
expressApp.post('/activity/mouse_click/', (req, res) => {postAnalytics(req, res, 'mouse_click')});
expressApp.put('/activity/mouse_click/:id', (req, res) => {putAnalytics(req, res, 'mouse_click')});
expressApp.delete('/activity/mouse_click/:id', (req, res) => {deleteAnalytics(req, res, 'mouse_click')});

// Activity Scroll API
expressApp.get('/activity/scroll/', (req, res) => {getAllAnalytics(req, res, 'scroll')});
expressApp.get('/activity/scroll/:id', (req, res) => {getAnalytics(req, res, 'scroll')});
expressApp.post('/activity/scroll/', (req, res) => {postAnalytics(req, res, 'scroll')});
expressApp.put('/activity/scroll/:id', (req, res) => {putAnalytics(req, res, 'scroll')});
expressApp.delete('/activity/scroll/:id', (req, res) => {deleteAnalytics(req, res, 'scroll')});

// Activity Key Down API
expressApp.get('/activity/key_down/', (req, res) => {getAllAnalytics(req, res, 'key_down')});
expressApp.get('/activity/key_down/:id', (req, res) => {getAnalytics(req, res, 'key_down')});
expressApp.post('/activity/key_down/', (req, res) => {postAnalytics(req, res, 'key_down')});
expressApp.put('/activity/key_down/:id', (req, res) => {putAnalytics(req, res, 'key_down')});
expressApp.delete('/activity/key_down/:id', (req, res) => {deleteAnalytics(req, res, 'key_down')});

// Activity Key Up API
expressApp.get('/activity/key_up/', (req, res) => {getAllAnalytics(req, res, 'key_up')});
expressApp.get('/activity/key_up/:id', (req, res) => {getAnalytics(req, res, 'key_up')});
expressApp.post('/activity/key_up/', (req, res) => {postAnalytics(req, res, 'key_up')});
expressApp.put('/activity/key_up/:id', (req, res) => {putAnalytics(req, res, 'key_up')});
expressApp.delete('/activity/key_up/:id', (req, res) => {deleteAnalytics(req, res, 'key_up')});

// Activity Idle API
expressApp.get('/activity/idle/', (req, res) => {getAllAnalytics(req, res, 'idle')});
expressApp.get('/activity/idle/:id', (req, res) => {getAnalytics(req, res, 'idle')});
expressApp.post('/activity/idle/', (req, res) => {postAnalytics(req, res, 'idle')});
expressApp.put('/activity/idle/:id', (req, res) => {putAnalytics(req, res, 'idle')});
expressApp.delete('/activity/idle/:id', (req, res) => {deleteAnalytics(req, res, 'idle')});

function getAllAnalytics(req, res, location) {
  
  console.log(`GET ALL for ${location}`);
  
  let table = '';
  
  let queryString = 'SELECT * FROM ??';

  switch(location) {
    
    case 'static':
      table = 'static';
      break;
    
    case 'performance':
      table = 'performance';
      break;
    
    case 'load':
      table = 'load_activity';
      break;
      
    case 'unload':
      table = 'unload_activity';
      break;
      
    case 'mouse_movement':
      table = 'mouse_movement_activity';
      break;
      
    case 'mouse_click':
      table = 'mouse_click_activity';
      break;
      
    case 'scroll':
      table = 'scroll_activity';
      break;
    
    case 'key_down':
      table = 'key_down_activity';
      break;
      
    case 'key_up':
      table = 'key_up_activity';
      break;
      
    case 'idle':
      table = 'idle_activity';
      break;
  }

  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: [table]
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function getAnalytics(req, res, location) {
  
  let {id} = req.params;
  
  console.log(`GET for ${location} @ ${id}`);
  
  let table = '';
  
  let queryString = 'SELECT * FROM ?? WHERE ID = ?';
  
  switch(location) {
    
    case 'static':
      table = 'static';
      break;
    
    case 'performance':
      table = 'performance';
      break;
    
    case 'load':
      table = 'load_activity';
      break;
      
    case 'unload':
      table = 'unload_activity';
      break;
      
    case 'mouse_movement':
      table = 'mouse_movement_activity';
      break;
      
    case 'mouse_click':
      table = 'mouse_click_activity';
      break;
      
    case 'scroll':
      table = 'scroll_activity';
      break;
    
    case 'key_down':
      table = 'key_down_activity';
      break;
      
    case 'key_up':
      table = 'key_up_activity';
      break;
      
    case 'idle':
      table = 'idle_activity';
      break;
  }

  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: [table, id]
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function postAnalytics(req, res, location) {

  console.log(`POST for ${location}`);
  
  let queryString;
  
  let queryItems = [];
  
  switch(location) {
    
    case 'static': {
      let {user_agent, language, accept_cookies, allow_js, allow_images, 
           allow_css, window_size_x, window_size_y, screen_size_x, 
           screen_size_y, connection_type, session_id, timestamp} = req.body;
           
      if(user_agent == null) user_agent = 'NULL';
      if(language == null) language = 'NULL';
      if(accept_cookies == null) accept_cookies = -1;
      if(allow_js == null) allow_js = -1;
      if(allow_images == null) allow_images = -1;
      if(allow_css == null) allow_css = -1;
      if(window_size_x == null) window_size_x = -1;
      if(window_size_y == null) window_size_y = -1;
      if(screen_size_x == null) screen_size_x = -1;
      if(screen_size_y == null) screen_size_y = -1;
      if(connection_type == null) connection_type = 'NULL';
      if(session_id == null) session_id = 'NULL';
      if(timestamp == null) timestamp = -1;
           
      queryItems[0] = user_agent;
      queryItems[1] = language;
      queryItems[2] = accept_cookies;
      queryItems[3] = allow_js;
      queryItems[4] = allow_images;
      queryItems[5] = allow_css;
      queryItems[6] = window_size_x;
      queryItems[7] = window_size_y;
      queryItems[8] = screen_size_x;
      queryItems[9] = screen_size_y;
      queryItems[10] = connection_type;
      queryItems[11] = session_id;
      queryItems[12] = timestamp;
      
      queryString = 'INSERT INTO static (user_agent, language, ' + 
        'accept_cookies, allow_js, allow_images, allow_css, window_size_x, ' + 
        'window_size_y, screen_size_x, screen_size_y, connection_type, ' + 
        'session_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    } break;
    
    case 'performance': {
      let {timestamp, timing, start_load_time, end_load_time, total_load_time,
           session_id} = req.body;
           
      if(timestamp == null) timestamp = -1;
      if(timing == null) timing = 'NULL';
      if(start_load_time == null) start_load_time = -1;
      if(end_load_time == null) end_load_time = -1;
      if(total_load_time == null) total_load_time = -1;
      if(session_id == null) session_id = 'NULL';
           
      queryItems[0] = timestamp;
      queryItems[1] = timing;
      queryItems[2] = start_load_time;
      queryItems[3] = end_load_time;
      queryItems[4] = total_load_time;
      queryItems[5] = session_id;
      
      queryString = 'INSERT INTO performance (timestamp, timing, start_load_time, end_load_time, total_load_time, session_id) VALUES (?, ?, ?, ?, ?, ?)';
    } break;
    
    case 'load': {
      
      let {session_id, timestamp, page} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(timestamp == null) timestamp = -1;
      if(page == null) page = 'NULL';
      
      queryItems[0] = session_id;
      queryItems[1] = timestamp;
      queryItems[2] = page;
      
      queryString = 'INSERT INTO load_activity (session_id, timestamp, page) VALUES (?, ?, ?)';
      
    } break;
    
    case 'unload': {
    
      let {session_id, activity_timestamp, unload_timestamp} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(unload_timestamp == null) unload_timestamp = -1;
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = unload_timestamp;
      
      queryString = 'INSERT INTO unload_activity (session_id, activity_timestamp, unload_timestamp) VALUES (?, ?, ?)';
      
    } break;
    
    case 'mouse_movement': {
    
      let {session_id, activity_timestamp, mouse_movement_timestamp, position_x, position_y} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(mouse_movement_timestamp == null) mouse_movement_timestamp = -1;
      if(position_x == null) position_x = -1;
      if(position_y == null) position_y = -1;
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = mouse_movement_timestamp;
      queryItems[3] = position_x;
      queryItems[4] = position_y;
      
      queryString = 'INSERT INTO mouse_movement_activity (session_id, activity_timestamp, mouse_movement_timestamp, position_x, position_y) VALUES (?, ?, ?, ?, ?)';
      
    } break;
    
    case 'mouse_click': {
    
      let {session_id, activity_timestamp, mouse_click_timestamp, button, position_x, position_y} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(mouse_click_timestamp == null) mouse_click_timestamp = -1;
      if(button == null) button = -1;
      if(position_x == null) position_x = -1;
      if(position_y == null) position_y = -1;
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = mouse_click_timestamp;
      queryItems[3] = button;
      queryItems[4] = position_x;
      queryItems[5] = position_y;
      
      queryString = 'INSERT INTO mouse_click_activity (session_id, activity_timestamp, mouse_click_timestamp, button, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?)';
      
    } break;
    
    case 'scroll': {
    
      let {session_id, activity_timestamp, scroll_timestamp, position} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(scroll_timestamp == null) scroll_timestamp = -1;
      if(position == null) position = -1;
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = scroll_timestamp;
      queryItems[3] = position;
      
      queryString = 'INSERT INTO scroll_activity (session_id, activity_timestamp, scroll_timestamp, position) VALUES (?, ?, ?, ?)';
      
    } break;
    
    case 'key_down': {
    
      let {session_id, activity_timestamp, key_down_timestamp, key_down} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(key_down_timestamp == null) key_down_timestamp = -1;
      if(key_down == null) key_down = 'NULL';
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = key_down_timestamp;
      queryItems[3] = key_down;
      
      queryString = 'INSERT INTO key_down_activity (session_id, activity_timestamp, key_down_timestamp, key_down) VALUES (?, ?, ?, ?)';
      
    } break;
    
    case 'key_up': {
    
      let {session_id, activity_timestamp, key_up_timestamp, key_up} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(key_up_timestamp == null) key_up_timestamp = -1;
      if(key_up == null) key_up = 'NULL';
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = key_up_timestamp;
      queryItems[3] = key_up;
      
      queryString = 'INSERT INTO key_up_activity (session_id, activity_timestamp, key_up_timestamp, key_up) VALUES (?, ?, ?, ?)';
      
    } break;
    
    case 'idle': {
    
      let {session_id, activity_timestamp, break_end, idle_time} = req.body;
      
      if(session_id == null) session_id = 'NULL';
      if(activity_timestamp == null) activity_timestamp = -1;
      if(break_end == null) break_end = -1;
      if(idle_time == null) idle_time = -1;
      
      queryItems[0] = session_id;
      queryItems[1] = activity_timestamp;
      queryItems[2] = break_end;
      queryItems[3] = idle_time;
      
      queryString = 'INSERT INTO idle_activity (session_id, activity_timestamp, break_end, idle_time) VALUES (?, ?, ?, ?)';
      
    } break;
  }

  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: queryItems
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    res.status(200).send(results);
  });
}

function putAnalytics(req, res, location) {
  
  let queryString = 'UPDATE ??  SET ';
  
  let {id} = req.params;
  
  console.log(`PUT for ${location} @ ${id}`);
  
  let queryItems = [];

  switch(location) {
    
    case 'static': {
      
      queryItems.push('static');
      
      let {user_agent, language, accept_cookies, allow_js, allow_images, 
           allow_css, window_size_x, window_size_y, screen_size_x, 
           screen_size_y, connection_type, session_id, timestamp} = req.body;
           
      if(user_agent != null) {
        queryString += 'user_agent = ?, ';
        queryItems.push(user_agent);
      }
      
      if(language != null) {
        queryString += 'language = ?, ';
        queryItems.push(language);
      }
      
      if(accept_cookies != null) {
        queryString += 'accept_cookies = ?, ';
        queryItems.push(accept_cookies);
      }
      
      if(allow_js != null) {
        queryString += 'allow_js = ?, ';
        queryItems.push(allow_js);
      }
      
      if(allow_images != null) {
        queryString += 'allow_images = ?, ';
        queryItems.push(allow_images);
      }
      
      if(allow_css != null) {
        queryString += 'allow_css = ?, ';
        queryItems.push(allow_css);
      }
      
      if(window_size_x != null) {
        queryString += 'window_size_x = ?, ';
        queryItems.push(window_size_x);
      }
      
      if(window_size_y != null) {
        queryString += 'window_size_y = ?, ';
        queryItems.push(window_size_y);
      }
      
      if(screen_size_x != null) {
        queryString += 'screen_size_x = ?, ';
        queryItems.push(screen_size_x);
      }
      
      if(screen_size_y != null) {
        queryString += 'screen_size_y = ?, ';
        queryItems.push(screen_size_y);
      }
            
      if(connection_type != null) {
        queryString += 'connection_type = ?, ';
        queryItems.push(connection_type);
      }
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(timestamp != null) {
        queryString += 'timestamp = ?, ';
        queryItems.push(timestamp);
      }
    } break;
    
    case 'performance': {
      
      queryItems.push('performance');
      
      let {timestamp, timing, start_load_time, end_load_time, total_load_time,
        session_id} = req.body;
      
      if(timestamp != null) {
        queryString += 'timestamp = ?, ';
        queryItems.push(timestamp);
      }
      
      if(timing != null) {
        queryString += 'timing = ?, ';
        queryItems.push(timing);
      }
      
      if(start_load_time != null) {
        queryString += 'start_load_time = ?, ';
        queryItems.push(start_load_time);
      }
      
      if(end_load_time != null) {
        queryString += 'end_load_time = ?, ';
        queryItems.push(end_load_time);
      }
      
      if(total_load_time != null) {
        queryString += 'total_load_time = ?, ';
        queryItems.push(total_load_time);
      }
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
    } break;
    
    case 'load': {
      
      queryItems.push('load_activity');
      
      let {session_id, timestamp, page} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(timestamp != null) {
        queryString += 'timestamp = ?, ';
        queryItems.push(timestamp);
      }
      
      if(page != null) {
        queryString += 'page = ?, ';
        queryItems.push(page);
      }
     } break;
    
    case 'unload': {
      
      queryItems.push('unload_activity');
      
      let {session_id, activity_timestamp, unload_timestamp} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(unload_timestamp != null) {
        queryString += 'unload_timestamp = ?, ';
        queryItems.push(unload_timestamp);
      }
    } break;
    
    case 'mouse_movement': {
      
      queryItems.push('mouse_movement_activity');
      
      let {session_id, activity_timestamp, mouse_movement_timestamp, position_x, position_y} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(mouse_movement_timestamp != null) {
        queryString += 'mouse_movement_timestamp = ?, ';
        queryItems.push(mouse_movement_timestamp);
      }
      
      if(position_x != null) {
        queryString += 'position_x = ?, ';
        queryItems.push(position_x);
      }
      
      if(position_y != null) {
        queryString += 'position_y = ?, ';
        queryItems.push(position_y);
      }
    } break;
    
    case 'mouse_click': {
      
      queryItems.push('mouse_click_activity');
      
      let {session_id, activity_timestamp, mouse_click_timestamp, button, position_x, position_y} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(mouse_click_timestamp != null) {
        queryString += 'mouse_click_timestamp = ?, ';
        queryItems.push(mouse_click_timestamp);
      }
      
      if(button != null) {
        queryString += 'button = ?, ';
        queryItems.push(button);
      }
      
      if(position_x != null) {
        queryString += 'position_x = ?, ';
        queryItems.push(position_x);
      }
      
      if(position_y != null) {
        queryString += 'position_y = ?, ';
        queryItems.push(position_y);
      }
      
    } break;
    
    case 'scroll': {
      
      queryItems.push('scroll_activity');
      
      let {session_id, activity_timestamp, scroll_timestamp, position} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(scroll_timestamp != null) {
        queryString += 'scroll_timestamp = ?, ';
        queryItems.push(scroll_timestamp);
      }
      
      if(position != null) {
        queryString += 'position = ?, ';
        queryItems.push(position);
      }
      
    } break;
    
    case 'key_down': {
      
      queryItems.push('key_down_activity');
      
      let {session_id, activity_timestamp, key_down_timestamp, key_down} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(key_down_timestamp != null) {
        queryString += 'key_down_timestamp = ?, ';
        queryItems.push(key_down_timestamp);
      }
      
      if(key_down != null) {
        queryString += 'key_down = ?, ';
        queryItems.push(key_down);
      }
    } break;
    
    case 'key_up': {    
      
      queryItems.push('key_up_activity');
      
    let {session_id, activity_timestamp, key_up_timestamp, key_up} = req.body;

    if(session_id != null) {
      queryString += 'session_id = ?, ';
      queryItems.push(session_id);
    }
    
    if(activity_timestamp != null) {
      queryString += 'activity_timestamp = ?, ';
      queryItems.push(activity_timestamp);
    }
    
    if(key_up_timestamp != null) {
      queryString += 'key_up_timestamp = ?, ';
      queryItems.push(key_up_timestamp);
    }
    
    if(key_up != null) {
      queryString += 'key_up = ?, ';
      queryItems.push(key_up);
    }
    
    } break;
    
    case 'idle': {   
      
      queryItems.push('idle_activity');
      
      let {session_id, activity_timestamp, break_end, idle_time} = req.body;
      
      if(session_id != null) {
        queryString += 'session_id = ?, ';
        queryItems.push(session_id);
      }
      
      if(activity_timestamp != null) {
        queryString += 'activity_timestamp = ?, ';
        queryItems.push(activity_timestamp);
      }
      
      if(break_end != null) {
        queryString += 'break_end = ?, ';
        queryItems.push(break_end);
      }
      
      if(idle_time != null) {
        queryString += 'idle_time = ?, ';
        queryItems.push(idle_time);
      }
      
    } break;
  }

  let updatedQueryString = queryString.substring(0, queryString.length - 2);
  
  updatedQueryString += ' WHERE id = ?';
  
  console.log(updatedQueryString);
  
  queryItems.push(id);
  
  console.log(queryItems);
  
  connectionPool.query({
    
    sql: updatedQueryString,
    
    timeout: 40000,
    
    values: queryItems
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function deleteAnalytics(req, res, location) {
  let table = '';
  
  let {id} = req.params;
  
  console.log(`DELETE for ${location} @ ${id}`);
  
  let queryString = 'DELETE FROM ?? WHERE ID = ?';
  
  switch(location) {
    
    case 'static':
      table = 'static';
      break;
    
    case 'performance':
      table = 'performance';
      break;
    
    case 'load':
      table = 'load_activity';
      break;
      
    case 'unload':
      table = 'unload_activity';
      break;
      
    case 'mouse_movement':
      table = 'mouse_movement_activity';
      break;
      
    case 'mouse_click':
      table = 'mouse_click_activity';
      break;
      
    case 'scroll':
      table = 'scroll_activity';
      break;
    
    case 'key_down':
      table = 'key_down_activity';
      break;
      
    case 'key_up':
      table = 'key_up_activity';
      break;
      
    case 'idle':
      table = 'idle_activity';
      break;
  }

  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: [table, id]
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

// Setting up the REST server and the connection pool
expressApp.on('exit', () => {
  connectionPool.end((error) => {
    return console.error(error.message);
  });
});

expressApp.listen(
  4000,
  (error) => {
    
    if(error) console.error(error);
    
    connectionPool = mySqlApp.createPool({
      connectionLimit: 50,
      host: HOST,
      user: USERNAME,
      password: PASSWORD,
      database: DATABASE
    });
    
  }
);