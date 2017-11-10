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

  var animate = function(){
    // MOVE
    if(current_action.steps > 0){
        if(current_action.heading == 'LEFT'){
            img.style.left = left_pos-- + 'px';
            img.src = left_url_getter()
        }
        if(current_action.heading == 'RIGHT'){
            img.style.left = left_pos++ + 'px';
            img.src = right_url_getter()
        }
        if(current_action.heading == 'UP'){
            img.style.top = top_pos-- + 'px';
            img.src = up_url_getter()
        }
        if(current_action.heading == 'DOWN'){
            img.style.top = top_pos++ + 'px';
            img.src = down_url_getter()
        }
        if(current_action.heading == 'NONE'){
            img.src = chrome.extension.getURL('img/F_SIT.png')
        }
        current_action.steps--;
    }else{
        current_action.heading = choose(actions);
        current_action.steps = choose(steps);
    }
    // CHECK BOUNDARIES
    if(left_pos > window.innerWidth - walk_margin){
        current_action.heading = 'LEFT';
        current_action.steps = choose(steps);
    }
    if(left_pos < 0){
        current_action.heading = 'RIGHT';
        current_action.steps = choose(steps);
    }
    if(top_pos > window.innerHeight - walk_margin){
        current_action.heading = 'UP';
        current_action.steps = choose(steps);
    }
    if(top_pos < 0){
        current_action.heading = 'DOWN';
        current_action.steps = choose(steps);
    }
  }
  
  // LOOP
  window.setInterval(animate, interval)
  
  // BEHAVIOR
  document.body.addEventListener('click',function(x){
      if(Math.floor(Math.random() * 100) > 15){
          current_action.heading = 'NONE';
          current_action.steps = choose(steps);
      }
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
        return chrome.extension.getURL(arr[idx]);
    }
}
