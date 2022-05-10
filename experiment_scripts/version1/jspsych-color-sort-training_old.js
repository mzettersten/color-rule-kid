/**
 * jspsych-color-sort-training
 * Martin Zettersten
 */

jsPsych.plugins['color-sort-training'] = (function() {

  var plugin = {};
  
  var context = new AudioContext();
  
  jsPsych.pluginAPI.registerPreload('color-sort-training', 'stimulus', 'image');
  jsPsych.pluginAPI.registerPreload('color-sort-training', 'audioBeep', 'audio');
  jsPsych.pluginAPI.registerPreload('color-sort-training', 'audioTaDa', 'audio');
  jsPsych.pluginAPI.registerPreload('color-sort-training', 'audioBoing', 'audio');
  

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [170,170];
	  trial.prompt_image_size = trial.alien_image_size || [250,250];
	  trial.condition = trial.condition || "active";
	  trial.audioDur = trial.audioDur || 1300;
	  trial.audioBeep = trial.audioBeep || "stims/bleep.m4a";
	  trial.audioBoing = trial.audioBoing || "stims/buzz_1000msSilence.m4a";
	  trial.audioTaDa = trial.audioTaDa || "stims/tada_1000msSilence.m4a";
	  trial.onsetWait = trial.onsetWait || 0;
	  trial.targetIndex = trial.targetIndex || 0;
	  trial.endTrialPause = trial.endTrialPause || 500;
	  trial.feedback = trial.feedback || false;
	  trial.input = trial.input || "click";
	  trial.isRepeatedTrial = trial.isRepeatedTrial || 0;
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  trial.animationTime = trial.animationTime || 600;
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
      display_element.append($("<svg id='jspsych-color-sort-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var s = Snap("#jspsych-color-sort-canvas");
	  
	  //middle rectangle
	  var rect = s.rect(410,325, 200, 200,10,10);
	  rect.attr({
		  fill: "#FFFFFF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
				  

	  //set location dictionaries
	  var alienLocations = {
		  left: [35,152],
		  right: [755,150]
	  };
	  
	  var centerLocation=[425,340];
	  
	  var targetLocations = {
		  left: [75,340],
		  right: [775,340]
	  };
	  
	  var circleLocations = {
		  left: [160, 425],
		  right: [860, 425]
	  }
	  
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
	  
	  //load cat dog images
	  
	  var leftHead = s.image("stims/dogHead.png", alienLocations["left"][0], alienLocations["left"][1], 250,190);
	  var rightHead = s.image("stims/catHead.png", alienLocations["right"][0], alienLocations["right"][1]-20, 200,200);
	  
	  var leftFeet = s.image("stims/dogFeet.png", 56, 512, 200,70);
	  var rightFeet= s.image("stims/catFeet.png", 756, 512, 200,70);
	  
	  var leftTail = s.image("stims/dogTail.png", 10, 362, 112,134);
	  var rightTail= s.image("stims/catTail.png", 910, 362, 112,134);
	  
	  
	  //put cat and dog pieces together
	  var leftImage = s.group(leftHead,leftFeet, leftTail, leftCircle);
	  var rightImage = s.group(rightHead,rightFeet, rightTail, rightCircle);
	  
	  //load pie stimulus image
	  var stimulus= s.image(trial.stimulus, centerLocation[0], centerLocation[1],trial.image_size[0],trial.image_size[1]);
	  
	//function to play audio
	  function playSound(buffer) {
	    var source = context.createBufferSource(); // creates a sound source
	    source.buffer = jsPsych.pluginAPI.getAudioBuffer(buffer);                    // tell the source which sound to play
	    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	    source.start(0);                           // play the source now
	  }
	  
	  var start_time = (new Date()).getTime();
	  
	  var rt = 0;
	  var choice = 0;
	  
	  if (trial.input == "touch") {
		leftCircle.touchstart(function() {
			playSound(trial.audioBeep);
			choice = "left";
			var isRight = 0;
			if (choice ==trial.targetLoc) {
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
			inputEvent(stimulus, choice, isRight, leftImage,rightImage,leftImage);
		});
		rightCircle.touchstart(function() {
			playSound(trial.audioBeep);
			choice = "right";
			var isRight = 0;
			if (choice ==trial.targetLoc) {
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
			inputEvent(stimulus, choice, isRight,rightImage,leftImage,rightImage);
		});
	} else {
		leftCircle.click(function() {
			playSound(trial.audioBeep);
			choice = "left";
			var isRight = 0;
			if (choice ==trial.targetLoc) {
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
			inputEvent(stimulus, choice, isRight, leftImage,rightImage,leftImage);
			});
		rightCircle.click(function() {
			playSound(trial.audioBeep);
			choice = "right";
			var isRight = 0;
			if (choice ==trial.targetLoc) {
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
			inputEvent(stimulus, choice,isRight, rightImage,leftImage,rightImage);
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
		console.log(isRight);
		var end_time = (new Date()).getTime();
		rt = end_time - start_time;
		var completeAnimal = s.group(chosenImage,stimulus);
		im.animate({
			x: targetLocations[imChoice][0],
			y: targetLocations[imChoice][1],
		},1000,mina.easeinout,function() {
			if (trial.feedback) {
				if (isRight==1) {
					//audioTaDa.play()
					//do jumping animation
					completeAnimal.animate({ transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
						completeAnimal.animate({ transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
							completeAnimal.animate({transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
								completeAnimal.animate({transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
									completeAnimal.animate({transform: 'translate(0,-80)'},trial.animationTime/2,mina.easeinout,function() {
										completeAnimal.animate({transform: 'translate(0,0)'},trial.animationTime/2,mina.easeout,function() {
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
					//audioBoing.play();
					//do rejection animation
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