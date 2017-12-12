// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

window.onload = function() {
  // THE MAGIC
  const cat = {};
  
  var left_pos = Math.floor(Math.random() * window.innerWidth - 100);
  var top_pos = Math.floor(Math.random() * window.innerHeight - 100);
  
  var actions = ['LEFT', 'RIGHT', 'UP', 'DOWN', 'NONE']
  var steps = [10, 50, 100, 200, 400];
  var interval = 50;
  var walk_margin = 400;
  var current_action = {
      heading: "NONE",
      steps: 50,
  }
  var step_distance = 2;
  
  // UI
  const img = document.createElement('img');
  img.src = chrome.extension.getURL("img/F_SIT.png");
  img.style.top = top_pos + 'px';
  img.style.left = left_pos + 'px'
  img.style.position = 'fixed';
  
  img.id = "cat"
  img.zIndex = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
  const cont = document.createElement('div');
  cont.append(img)
  document.getElementsByTagName("body")[0].appendChild(cont);
  
  // AUTO INCREMENTING LIST FUNCTIONS
  var left_url_getter = next_frame(['img/L1.png','img/L2.png','img/L3.png'])
  var right_url_getter = next_frame(['img/R1.png','img/R2.png','img/R3.png'])
  var up_url_getter = next_frame(['img/B1.png','img/B2.png','img/B3.png'])
  var down_url_getter = next_frame(['img/F1.png','img/F2.png','img/F3.png'])


  var imgmap = {
    'img/B1.png' : {
        width: '46px',
        height: '50px'
    },
    'img/B2.png' : {
        width: '46px',
        height: '50px'
    },
    'img/B3.png' : {
        width: '46px',
        height: '50px'
    },
    'img/F_SIT.png' : {
        width: '50px',
        height:  '50px'
    },
    'img/F1.png': {
      width: '40px',
      height: '50px'
    },
    'img/F2.png': {
      width: '44px',
      height: '48px'
    },
    'img/F3.png': {
      width: '48px',
      height: '51px'
    },
    'img/L1.png': {
      width: '64px',
      height: '50px'
    },
    'img/L2.png': {
      width: '60px',
      height: '48px'    
    },
    'img/L3.png': {
      width: '58px',
      height: '48px'      
    },
    'img/R1.png': {
      width: '58px',
      height: '50px'  
    },
    'img/R2.png': {
      width: '60px',
      height: '48px'
    },
    'img/R3.png': {
      width: '58px',
      height: '48px'
    },
  }
  
  let state = getInitialState();
  
  const loop = function(){
    state = update_state(state);
    animate(state); 

  }
  // LOOP
  window.setInterval(loop, interval)
  
  function update_state(state){
    let new_state = {};
    let cat_br = document.querySelector('#cat').getBoundingClientRect();
    new_state.top_pos = cat_br.top;
    new_state.left_pos = cat_br.left;
    new_state.walk_margin = walk_margin;
    new_state.current_action = get_action(state);
    new_state.current_action.steps = new_state.current_action.steps - 1;
    return new_state;
  }

  var get_action = function(state){
    current_action = state.current_action;
    // if we need a new action, get it
    if(state.current_action.steps < 1){
      current_action.heading = choose(actions);
      current_action.steps = choose(steps);
      return current_action;
    }
    // CHECK BOUNDARIES
    if(state.left_pos > window.innerWidth - state.walk_margin){
        current_action.heading = 'LEFT';
        current_action.steps = choose(steps);
    }
    if(state.left_pos < 0){
        current_action.heading = 'RIGHT';
        current_action.steps = choose(steps);
    }
    if(state.top_pos > window.innerHeight - state.walk_margin){
        current_action.heading = 'UP';
        current_action.steps = choose(steps);
    }
    if(state.top_pos < 0){
        current_action.heading = 'DOWN';
        current_action.steps = choose(steps);
    }
    return current_action;
  }


  var animate = function(state){  
    const action = state.current_action;
    var clean = '';
    // MOVE
    if(action.heading == 'LEFT'){
        img.style.left = state.left_pos - step_distance + 'px';
        var urler = left_url_getter()
        img.src = urler.url
        img.clean_url = urler.clean_url
    }
    if(action.heading == 'RIGHT'){
        img.style.left = state.left_pos + step_distance + 'px';
        var urler =  right_url_getter()
        img.src = urler.url
        img.clean_url = urler.clean_url
    }
    if(action.heading == 'UP'){
        img.style.top = state.top_pos - step_distance + 'px';
        var urler =  up_url_getter()
        img.src = urler.url
        img.clean_url = urler.clean_url
    }
    if(action.heading == 'DOWN'){
        img.style.top = state.top_pos + step_distance + 'px';
        var urler =  down_url_getter()
        img.src = urler.url
        img.clean_url = urler.clean_url
    }
    if(action.heading == 'NONE'){
        img.src = chrome.extension.getURL('img/F_SIT.png')
        img.clean_url = 'img/F_SIT.png'
    }
    if(img.height > 200) {
      console.log(img.src);
      img.style.height = imgmap[img.clean_url].height;  
      img.style.width = imgmap[img.clean_url].width;
    }
  }
  

  
  // BEHAVIOR
  document.body.addEventListener('click',function(x){
      if(Math.floor(Math.random() * 100) > 15){
          current_action.heading = 'NONE';
          current_action.steps = choose(steps);
      }
    })
  document.querySelector('#cat').addEventListener('click',function(x){
      x.target.style.display = 'none'
    })
  }
// MAKE RAND CHOICE FROM ARRAY
function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// AUTO INCREMENTING LIST FUNCTION FACTORY FUNCTION
function next_frame(arr){
    var idx = 0;
    var last_idx = arr.length;
    return function next_url(){
        idx = idx + 1;
        if(idx > last_idx - 1){
            idx = 0;
        }
        return {
          url: chrome.extension.getURL(arr[idx]),
          clean_url: arr[idx]
        };
    }
}
function getInitialState(){
  const state = {};
  state.current_action = {
      heading: "NONE",
      steps: 50,
  }
  return state;
}
