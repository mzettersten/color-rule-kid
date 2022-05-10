/**
 * jspsych-color-sort
 * Martin Zettersten
 */

jsPsych.plugins['color-sort'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('color-sort', 'stimulus', 'image');
  //jsPsych.pluginAPI.registerPreload('color-sort', 'audioBeep', 'audio');
  //jsPsych.pluginAPI.registerPreload('color-sort', 'audioTaDa', 'audio');
  //jsPsych.pluginAPI.registerPreload('color-sort', 'audioBoing', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [200,200];
	  trial.alien_image_size = trial.alien_image_size || [250,250];
	  trial.condition = trial.condition || "active";
	  trial.imageLeft = trial.imageLeft || "stims/alien1_gray.png";
	  trial.imageRight = trial.imageRight || "stims/alien2_gray.png";
	  trial.audioDur = trial.audioDur || 1300;
	  trial.audioBeep = trial.audioBeep || "stims/bleep.m4a";
	  trial.audioBoing = trial.audioBoing || "stims/buzz_1000msSilence.m4a";
	  trial.audioTaDa = trial.audioTaDa || "stims/tada_1000msSilence.m4a";
	  trial.onsetWait = trial.onsetWait || 0;
	  trial.targetIndex = trial.targetIndex || 0;
	  trial.endTrialPause = trial.endTrialPause || 500;
	  trial.feedback = trial.feedback || false;
	  trial.colorAnimation = trial.colorAnimation || 1;
	  trial.input = trial.input || "click";
	  trial.scoreBox = trial.scoreBox || 0;
	  trial.scoreBoxOrientation = trial.scoreBoxOrientation || "vertical";
	  trial.isRepeatedTrial = trial.isRepeatedTrial || 0;
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  trial.animationTime = trial.animationTime || 600;
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-color-sort-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-color-sort-canvas");
	  console.log(trial.stimName);
	  //set up color dictionary for animating colors
	  var colorDict = {
		  high_A_000: ['rgb(220,20,0)','rgb(130,30,180)','rgb(30,90,210)'],
		  high_A_001: ['rgb(220,20,0)','rgb(130,30,180)','rgb(250,240,0)'],
		  high_A_010: ['rgb(220,20,0)','rgb(250,120,30)','rgb(30,90,210)'],
		  high_A_011: ['rgb(220,20,0)','rgb(250,120,30)','rgb(250,240,0)'],
		  high_B_100: ['rgb(120,80,40)','rgb(130,30,180)','rgb(30,90,210)'],
		  high_B_101: ['rgb(120,80,40)','rgb(130,30,180)','rgb(250,240,0)'],
		  high_B_110: ['rgb(120,80,40)','rgb(250,120,30)','rgb(30,90,210)'],
		  high_B_111: ['rgb(120,80,40)','rgb(250,120,30)','rgb(250,240,0)'],
		  low_A_000: ['rgb(170,160,40)', 'rgb(200,100,70)', 'rgb(220,240,150)'],
		  low_A_001: ['rgb(170,160,40)', 'rgb(200,100,70)', 'rgb(150,200,180)'],
		  low_A_010: ['rgb(170,160,40)', 'rgb(70,100,90)', 'rgb(220,240,150)'],
		  low_A_011: ['rgb(170,160,40)', 'rgb(70,100,90)', 'rgb(150,200,180)'],
		  low_B_100: ['rgb(200,170,170)', 'rgb(200,100,70)', 'rgb(220,240,150)'],
		  low_B_101: ['rgb(200,170,170)', 'rgb(200,100,70)', 'rgb(150,200,180)'],
		  low_B_110: ['rgb(200,170,170)', 'rgb(70,100,90)', 'rgb(220,240,150)'],
		  low_B_111: ['rgb(200,170,170)', 'rgb(70,100,90)', 'rgb(150,200,180)']  
	  };
	  
	  //middle rectangle
	  var rect = s.rect(410,325, 200, 200,10,10);
	  rect.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
				  

	  //set location dictionaries
	  var alienLocations = {
		  left: [35,80],
		  right: [735,100]
	  };
	  
	  var centerLocation=[410,325];
	  
	  var targetLocations = {
		  left: [60,325],
		  right: [760,325]
	  };
	  
	  var circleLocations = {
		  left: [160, 425],
		  right: [860, 425]
	  }
	  
	  //alien parts
	  var neckLeft = s.rect(135,250, 50, 100,1,1);
	  neckLeft.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var neckRight= s.rect(835,250, 50, 100,1,1);
	  neckRight.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var legLeft1= s.rect(110,500, 20, 100,1,1);
	  legLeft1.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legRight1= s.rect(810,500, 20, 100,1,1);
	  legRight1.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legLeft2= s.rect(185,500, 20, 100,1,1);
	  legLeft2.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legRight2= s.rect(885,500, 20, 100,1,1);
	  legRight2.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legLeft3= s.rect(185,580, 50, 20,5,5);
	  legLeft3.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legRight3= s.rect(885,580, 50, 20,5,5);
	  legRight3.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legLeft4= s.rect(80,580, 50, 20,5,5);
	  legLeft4.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var legRight4= s.rect(780,580, 50, 20,5,5);
	  legRight4.attr({
		  fill: "black",
		  stroke: "#000",
		  strokeWidth: 1
	  });
	  
	  var leftCircle = s.circle(160, 425, 95);
	  leftCircle.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var rightCircle = s.circle(860, 425, 95);
	  rightCircle.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  //load aliens
	  
	  //var leftAlienHead = s.image(trial.imageLeft, alienLocations["left"][0], alienLocations["left"][1], trial.image_size[0],trial.image_size[1]);
	  //var rightAlienHead = s.image(trial.imageRight, alienLocations["right"][0], alienLocations["right"][1], trial.image_size[0],trial.image_size[1]);

	  var leftAlienFrag = '<svg version="1.1" id="alien1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 792" enable-background="new 0 0 612 792" xml:space="preserve"><g transform="matrix(3.665,0,0,3.665,-330.5,-309.2)"><path stroke="#000000" stroke-width="1.3643" d="M192.5,219.2c1.2,2.3,3.1,52.1,11.7,58.7c7.4,5.9,2.7,13.5-3.9,13.8c-9,0.8-20.7-53.4-19.3-56.8"/><path stroke="#000000" stroke-width="1.3643" d="M155.5,219.2c-1.4,2.3-3.1,52.1-11.7,58.7c-7.4,5.9-2.7,13.5,3.7,13.8c9.2,0.8,20.7-53.4,19.3-56.8"/><path stroke="#000000" stroke-width="1.3643" d="M181.6,231.9c1,2.3-2,45.2-1.6,55.2c0.4,12.5-3.1,12.5-9,11.7c-8.4-0.4-3.7-51.5-2-54.2"/></g><path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M374.7,183.1c0,0-12.7,45.2-33.7,64.4c-11.3-1.8-22.8-2.5-34.7-2.5c-13.8,0-27.3,1.2-40.6,3.5c-21.3-19.1-34.3-64-34.3-64l-41,14.8c0,0,16.4,42.7,11.3,70C128.4,305.4,78.3,378.5,78.3,463c0,120.5,102.2,218,228,218s227.4-97.5,227.4-218c0-86.4-52.3-161.1-128.3-196.4c-4.9-27.1,10.7-69,10.7-69L374.7,183.1L374.7,183.1z"/><g><path id="i" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M243.5,627.4c-3.7,9,19.9,47.4-7.2,76.6c-23.6,25.4-2.1,49.7,21.5,47c33.5-1.8,42.9-62.2,36.5-73.3"/><path id="h" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M159,593.5c-3.5,9,19.3,47.4-7.8,76.6c-23,25.4-2.1,49.7,22.2,47.2c32.8-2,42.7-62.4,35.7-73.5"/><path id="i_1_" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M372.6,627.4c3.7,9-19.9,47.4,7.2,76.6c23.6,25.4,2.1,49.7-21.5,47c-33.5-1.8-42.9-62.2-36.5-73.3"/><path id="h_1_" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M453.1,593.5c3.5,9-19.3,47.4,7.8,76.6c23,25.4,2.1,49.7-22.2,47.2c-32.8-2-42.7-62.4-35.7-73.5"/></g><g><path fill="#AFACAC" d="M173,437.1c-5.9,24.5-23,41.4-38.2,37.6c-15.2-3.8-22.8-26.7-16.9-51.2c5.9-24.5,23-41.4,38.2-37.6C171.3,389.6,178.9,412.5,173,437.1z"/><path fill="#AFACAC" d="M335.7,526.6c0,30.6-22.9,55.3-51.2,55.3c-28.3,0-51.2-24.8-51.2-55.3c0-30.6,22.9-55.3,51.2-55.3C312.8,471.2,335.7,496,335.7,526.6z"/><path fill="#AFACAC" d="M497.8,431c5,16.8,1.4,32.4-8.1,34.9c-9,2.3-20.1-7.8-25.6-23.4c-5.8-16.5-3.2-33.1,5.9-36.9c9.1-3.9,21.2,6.4,27,22.9C497.3,429.3,497.6,430.2,497.8,431z"/><path fill="#AFACAC" d="M421.9,543.7c-0.5,17.6-12.3,31.3-26.2,30.6c-13.2-0.7-23.7-14-24.3-30.6c-0.5-17.6,10.3-32.4,24.3-33.1c13.9-0.7,25.7,13,26.2,30.6C422,542.1,422,542.9,421.9,543.7z"/><path fill="#AFACAC" d="M414.1,413.8c0,25.2-18,45.6-40.2,45.6c-22.2,0-40.1-20.4-40.2-45.6c0-25.2,18-45.6,40.2-45.6S414.1,388.6,414.1,413.8C414.1,413.8,414.1,413.8,414.1,413.8z"/><path fill="#AFACAC" d="M203.5,511.7c7.8,14.3,7.4,29.4-0.8,33.7c-7.9,4.2-20.3-3.2-28.2-16.7c-8.2-14.1-8.5-29.5-0.7-34.6c7.8-5.1,20.8,2.2,29,16.3C203,510.8,203.2,511.3,203.5,511.7z"/></g><g transform="translate(-406.6,461.3)"><path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M698.3-358.3c0,54-43.5,97.9-97.9,97.9c-53.8,0-97.7-43.9-97.7-97.9s43.9-97.9,97.7-97.9C654.8-456.2,698.3-412.3,698.3-358.3z"/><path fill="#FFFFFF" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M669.6-376.1c0,26.5-21.5,48.2-47.8,48.2c-27.3,0-48.8-21.6-48.8-48.2s21.5-48,48.8-48C648.1-424.1,669.6-402.6,669.6-376.1z"/><path fill="#000000" d="M649.5-367.5c0,8.8-7,16-16.4,16c-8.6,0-15.6-7.2-15.6-16c0-8.8,7-16,15.6-16C642.5-383.5,649.5-376.3,649.5-367.5z"/><path id="f_2_" opacity="0.14" enable-background="new    " d="M692.6-391.7c0,1.6,0.8,3.1,0.8,4.5c0,54-44.5,97.9-98.1,97.9c-42.1,0-78.6-26.7-92.2-64.4c2.1,52.1,45.1,93.4,97.9,93.4c53.6,0,98.1-43.9,98.1-97.9C699-369.8,696.9-381.1,692.6-391.7L692.6-391.7z"/></g><g transform="translate(-406.6,461.3)"><path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M726.9-358.3c0,54,43.5,97.9,97.9,97.9c53.4,0,97.9-43.9,97.1-97.9c0.8-54-43.7-97.9-97.1-97.9C770.4-456.2,726.9-412.3,726.9-358.3z"/><path fill="#FFFFFF" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M756.2-376.1c0,26.5,21.5,48.2,48,48.2c26.3,0,47.8-21.6,47.8-48.2s-21.5-48-47.8-48C777.6-424.1,756.2-402.6,756.2-376.1z"/><path fill="#000000" d="M776.3-367.5c0,8.8,7.2,16,15.8,16c9.2,0,16.4-7.2,16.4-16c0-8.8-7.2-16-16.4-16C783.5-383.5,776.3-376.3,776.3-367.5z"/><path id="f_1_" opacity="0.14" enable-background="new    " d="M912.2-391.5c0,1.6,0.8,3.1,0.8,4.5c0,54-44.5,97.9-98.1,97.9c-42.1,0-78.6-26.7-92.2-64.4c2.1,52.1,45.1,93.4,97.9,93.4c53.6,0,98.1-43.9,98.1-97.9C918.6-369.6,916.5-380.9,912.2-391.5L912.2-391.5z"/></g><g transform="matrix(3.665,0,0,3.665,-328.5,-580.7)" opacity="0.14"><path d="M231.6,264.3v2.7c0,32.8-27.7,59.5-62,59.5c-26.9,0-49.7-16.4-58.4-39.2c1.5,31.6,28.8,56.8,62.1,56.8c34.3,0,62-26.5,62-59.5C235.3,277.5,234,270.5,231.6,264.3z"/><g transform="translate(-.2188 166)"><path id="j" d="M156,163.5c-1,2.4,5.5,12.9-2,20.9c-6.4,6.9-0.6,13.6,5.9,12.9c9.2-0.5,11.7-17,9.9-20"/><path id="g" d="M132.9,154.2c-1,2.4,5.3,12.9-2.1,20.9c-6.3,6.9-0.6,13.6,6,12.9c9-0.5,11.7-17,9.8-20"/><path id="j_1_" d="M191.1,163.5c1,2.4-5.5,12.9,2,20.9c6.4,6.9,0.6,13.6-5.9,12.9c-9.2-0.5-11.7-17-9.9-20"/><path id="g_1_" d="M212.9,154.2c1,2.4-5.3,12.9,2.1,20.9c6.3,6.9,0.6,13.6-6,12.9c-9-0.5-11.7-17-9.8-20"/></g></g></svg>'
	  var rightAlienFrag = '<svg version="1.1" id="alien2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 792" enable-background="new 0 0 612 792" xml:space="preserve"> <g transform="translate(-478.85 -441.13)">	<path  stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M1038.2,741.1c0,18.3-1.6,289.4-4.6,306.7c-23.1,132.4-130.3-20.7-259-20.7c-126.7,0-232.6,156.1-257.9,26.8c-3.8-19.2-5.7-292.4-5.7-312.8c0-158,118-286,263.6-286S1038.2,583.2,1038.2,741.1L1038.2,741.1z"/> <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="795.5352" y1="996.4437" x2="777.7852" y2="1052.8137" gradientTransform="matrix(3.4216 0 0 -3.4216 -1935.5835 4050.5281)"><stop  offset="0" style="stop-color:#EB7331"/> <stop  offset="1" style="stop-color:#CF4913"/> </linearGradient> <path d="M929.8,642.1c0,79-64,143-143,143s-143-64-143-143s64-143,143-143S929.8,563.2,929.8,642.1L929.8,642.1z"/> <path fill="#FFFFFF" d="M879.7,633.2c0,54.3-44,98.3-98.3,98.3s-98.3-44-98.3-98.3s44-98.3,98.3-98.3S879.7,578.9,879.7,633.2L879.7,633.2z"/> <path fill="#2E3436" d="M827.9,633.2c0,25.7-20.8,46.5-46.5,46.5c-25.7,0-46.5-20.8-46.5-46.5s20.8-46.5,46.5-46.5C807.1,586.7,827.9,607.5,827.9,633.2L827.9,633.2z"/> <path fill="#FFFFFF" d="M815.4,618.9c0,7.9-6.4,14.4-14.4,14.4s-14.4-6.4-14.4-14.4s6.4-14.4,14.4-14.4S815.4,611,815.4,618.9z"/> <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="1074.35" y1="586.23" x2="1074.35" y2="644.62" gradientTransform="matrix(2.5257 0 0 -2.5257 -1940.0588 2455.5405)"><stop  offset="0" style="stop-color:#2E3436"/> <stop  offset="1" style="stop-color:#D8571D"/> </linearGradient> <path fill="#AFACAC" d="M966.7,860.4v25.2c0,8.4-36,15.2-80.8,15.2H661.1c-44.8,0-80.8-6.8-80.8-15.2v-25.2C655.4,857.6,904.5,787.6,966.7,860.4z"/> <path fill="#FFFFFF" d="M674.9,847.1c-19.3,3.2-37.1,6.2-52.9,8.5c0,0.6-0.1,1.1-0.1,1.7v51.4c0,10.2,6.7,18.5,15.2,18.5h25.3c8.4,0,15.2-8.3,15.2-18.5v-51.4C677.5,853.6,676.5,850.1,674.9,847.1z"/> <path fill="#2E3436" d="M765.3,868.7c-37.3,0-68.2,13.9-73.2,32h146.3C833.4,882.7,802.6,868.7,765.3,868.7z"/><path fill="#FFFFFF" d="M851,827.4c-4.8,0-9.7,0.1-14.7,0.2c-0.1,0.7-0.1,1.4-0.1,2.1v51.5c0,10.2,6.8,18.5,15.2,18.5h25.2c8.4,0,15.2-8.2,15.2-18.5v-51.5c0-0.1,0-0.2,0-0.2C879,828,865.3,827.3,851,827.4L851,827.4z"/> <path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M602.1,536.9c0,8.4-6.8,15.2-15.2,15.2c-8.4,0-15.2-6.8-15.2-15.2c0-8.4,6.8-15.2,15.2-15.2S602.1,528.5,602.1,536.9z"/> <path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M578.9,577c0,8.4-6.8,15.2-15.2,15.2c-8.4,0-15.2-6.8-15.2-15.2c0-8.4,6.8-15.2,15.2-15.2C572.1,561.9,578.9,568.7,578.9,577z"/> <path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M936.1,519.9c0,8.4,6.8,15.2,15.2,15.2c8.4,0,15.2-6.8,15.2-15.2c0-8.4-6.8-15.2-15.2-15.2S936.1,511.5,936.1,519.9z"/> <path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M959.3,560.1c0,8.4,6.8,15.2,15.2,15.2c8.4,0,15.2-6.8,15.2-15.2c0-8.4-6.8-15.2-15.2-15.2C966.1,544.9,959.3,551.7,959.3,560.1z"/> <path stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M982.5,595.8c0,8.4,6.8,15.2,15.2,15.2s15.2-6.8,15.2-15.2c0-8.4-6.8-15.2-15.2-15.2S982.5,587.4,982.5,595.8z"/> </g> </svg>';
	  
	  var leftAlienFragParsed = Snap.parse(leftAlienFrag);
	  var rightAlienFragParsed = Snap.parse(rightAlienFrag);
	  
	  s.append(leftAlienFragParsed);
	  s.append(rightAlienFragParsed );
	  
	  //select elements of SVG fragments to get at inner SVG
	  var leftAlienHead = s.select("#alien1");
	  var rightAlienHead = s.select("#alien2");
	  
	  //edit attributes of alien heads
	  leftAlienHead.attr({fill: '#D3D3D3',x: alienLocations["left"][0],y: alienLocations["left"][1], width: trial.alien_image_size[0], height: trial.alien_image_size[1]});
	  rightAlienHead.attr({fill: '#D3D3D3',x: alienLocations["right"][0],y: alienLocations["right"][1], width: trial.alien_image_size[0], height: trial.alien_image_size[1]});
	  
	  //group all alien pieces
	  var leftAlien = s.group(neckLeft,legLeft1,legLeft2,legLeft3,legLeft4,leftCircle,leftAlienHead);
	  var rightAlien = s.group(neckRight,legRight1,legRight2,legRight3,legRight4,rightCircle,rightAlienHead);
	  //g.appendTo(rightAlien);
	  //g1.appendTo(leftAlien);
	  
	  //load pie stimulus image
	  var stimulus= s.image(trial.stimulus, centerLocation[0], centerLocation[1],trial.image_size[0],trial.image_size[1]);
	  
	  //if score box paramter set, build score keeping box
	  if (trial.scoreBox == 1) {
	  	
	 
	  var scoreAdvance = 25
	  var scoreBoxLength = trial.scoreLength * scoreAdvance+5;
	  var scoreDotRadius=15;
	  var scoreWidth = 50;
	  var scoreDotYUp=25;
	  var scoreTileWidth=30;
	  var scoreGap = 7;
	  
	  //score
	  if (trial.scoreBoxOrientation == "horizontal") {
		  var scoreX = 510-(trial.scoreLength/2)*(scoreAdvance)-5;
		  var scoreY = 640
		  var scoreBox = s.rect(scoreX, scoreY,scoreBoxLength,scoreWidth,10,10);
		  var scoreDotY=scoreY+ 10;
		  var scoreDotX=scoreX+scoreGap;
		  //update score
		  for (i = 0; i < (trial.scoreLength-trial.score); i++) {
			  var scoreDot=s.rect(scoreDotX,scoreDotY,scoreDotRadius,scoreTileWidth,5,5,fill='#000000');
				scoreDotX = scoreDotX + scoreAdvance;
			  };

		  
	  } else if (trial.scoreBoxOrientation == "vertical") {
		  var scoreX = 1035
		  var scoreY = 150
		  var scoreBox = s.rect(scoreX, scoreY,scoreWidth,scoreBoxLength,10,10);
		  var scoreDotX=scoreX + 10;
		  var scoreDotY=trial.scoreLength * scoreDotYUp+scoreY+5;
		  //update score
		  for (i = 0; i < (trial.scoreLength-trial.score); i++) {
				  scoreDotY = scoreDotY - scoreAdvance;
				  var scoreDot=s.rect(scoreDotX,scoreDotY,scoreTileWidth,scoreDotRadius,5,5,fill='#000000');
			  };
	  };
	  
	  scoreBox.attr({
		  fill:'#C0C0C0',
		  stroke: "#000",
		  strokeWidth: 5,
	  });
  };	
		//function to play audio
  function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
  }
	  //load audio
	  //var audioBeep = new Audio(trial.audioBeep);
	  //var audioTaDa= new Audio(trial.audioTaDa);
	  //var audioBoing= new Audio(trial.audioBoing);
      //var source = context.createBufferSource();
      //source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audioBeep);
      //source.connect(context.destination);
      //startTime = context.currentTime + 0.1;

	
	  
	  var start_time = (new Date()).getTime();
	  
	  var rt = 0;
	  var choice = 0;
	  
	  if (trial.input == "touch") {
		leftCircle.touchstart(function() {
			//audioBeep.play();
			//source.start();
			playSound(trial.audioBeep);
			choice = "left";
			var isRight = 0;
			if (choice ==trial.categoryLoc) {
				isRight=1
			};
			if (trial.feedback) {
				if (isRight==1) {
					//audioTaDa.play();
					playSound(trial.audioTaDa);
				} else {
					//audioBoing.play();
					playSound(trial.audioBoing);
				};
			};
			inputEvent(stimulus, choice, isRight, leftAlien,rightAlien,leftAlienHead);
		});
		rightCircle.touchstart(function() {
			//audioBeep.play();
			//source.start();
			playSound(trial.audioBeep);
			choice = "right";
			var isRight = 0;
			if (choice ==trial.categoryLoc) {
				isRight=1
			};
			if (trial.feedback) {
				if (isRight==1) {
					//audioTaDa.play();
					playSound(trial.audioTaDa);
				} else {
					//audioBoing.play();
					playSound(trial.audioBoing);
				};
			};
			inputEvent(stimulus, choice, isRight, rightAlien, leftAlien,rightAlienHead);
		});
	} else {
		leftCircle.click(function() {
			//audioBeep.play();
			//source.start();
			playSound(trial.audioBeep);
			choice = "left";
			var isRight = 0;
			if (choice ==trial.categoryLoc) {
				isRight=1
			};
			if (trial.feedback) {
				if (isRight==1) {
					//audioTaDa.play();
					playSound(trial.audioTaDa);
				} else {
					//audioBoing.play();
					playSound(trial.audioBoing);
				};
			};
			inputEvent(stimulus, choice, isRight, leftAlien,rightAlien,leftAlienHead);
			});
		rightCircle.click(function() {
			//audioBeep.play();
			//source.start();
			playSound(trial.audioBeep);
			choice = "right";
			var isRight = 0;
			if (choice ==trial.categoryLoc) {
				isRight=1
			};
			if (trial.feedback) {
				if (isRight==1) {
					//audioTaDa.play();
					playSound(trial.audioTaDa);
				} else {
					//audioBoing.play();
					playSound(trial.audioBoing);
				};
			};
			inputEvent(stimulus, choice,isRight, rightAlien, leftAlien,rightAlienHead);
		});
	  };
	  
	  function inputEvent(im,imChoice, isRight, chosenImage, notChosenImage,chosenHead) {
		if (trial.input=="click") {
			leftCircle.unclick();
			rightCircle.unclick();
		} else {
			leftCircle.untouchstart();
			rightCircle.untouchstart();
		};
		var end_time = (new Date()).getTime();
		rt = end_time - start_time;
		var completeAlien = s.group(chosenImage,stimulus);
		im.animate({
			x: targetLocations[imChoice][0],
			y: targetLocations[imChoice][1],
		},1000,mina.easeinout,function() {
			//source.stop();
			if (trial.feedback) {
				if (isRight==1) {
					//feedback_positive.start();
					
					//audioTaDa.play()
					if (trial.colorAnimation==1) {
					//do color animation
					chosenHead.animate({fill: colorDict[trial.stimName][0]},trial.animationTime,mina.easeinout, function() {
						chosenHead.animate({fill: colorDict[trial.stimName][1]},trial.animationTime,mina.easeinout,function() {
							chosenHead.animate({fill: colorDict[trial.stimName][2]},trial.animationTime,mina.easeinout)
						});
					});
					};
					
					//do jumping animation
					completeAlien.animate({ transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
						completeAlien.animate({ transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
							completeAlien.animate({transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
								completeAlien.animate({transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
									completeAlien.animate({transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
										completeAlien.animate({transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
											setTimeout(function() {
												endTrial(isRight);
											}, trial.endTrialPause);
											});
										});
									});
								});
							});
						});
				} else {
					//feedback_negative.start();
					//audioBoing.play();
					//do rejection animation
					// chosenImage.animate({ transform: 'r20,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 	chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 		chosenImage.animate({ transform: 'r-20,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 			chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 				chosenImage.animate({transform: 'r20,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 					chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 						chosenImage.animate({ transform: 'r-20,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 							chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 								chosenImage.animate({ transform: 'r10,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 									chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 										chosenImage.animate({ transform: 'r-10,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 											chosenImage.animate({transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 												chosenImage.animate({ transform: 'r5,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 													chosenImage.animate({ transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 														chosenImage.animate({ transform: 'r-5,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear,function() {
					// 															chosenImage.animate({transform: 'r0,'+String(circleLocations[imChoice][0])+',' + String(circleLocations[imChoice][1])},trial.animationTime/16,mina.linear);
					// 														});
					// 													});
					// 												});
					// 											});
					// 										});
					// 									});
					// 								});
					// 							});
					// 						});
					// 					});
					// 				});
					// 			});
					// 		});
					// 	});
					// });
					im.animate({
						x: centerLocation[0],
						y: centerLocation[1],
					},trial.animationTime,mina.easeinout,function() {
						setTimeout(function() {
							endTrial(isRight);
						}, trial.endTrialPause);
					});
				};
			} else {
				setTimeout(function() {
					endTrial(isRight);
				}, trial.endTrialPause);
			};
		});
	};
	  
      function endTrial(isRight) {
		  
		  var trial_data = {
			  "stimulus": trial.stimulus,
			  "rt": rt,
			  "choice": choice,
			  "isRight": isRight,
			  "targetCategory": trial.category,
			  "targetLocation": trial.categoryLoc,
			  "isRepeatedTrial": trial.isRepeatedTrial
		  }; 
	      // clear the display
	      display_element.html('');
		  
		  jsPsych.finishTrial(trial_data);
	  };
  };	  
		
		return plugin;
})();