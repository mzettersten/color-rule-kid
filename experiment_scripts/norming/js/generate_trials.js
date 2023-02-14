function pairwise(list) {
	if (list.length < 2) { return []; }
	var first = list[0],
        rest  = list.slice(1),
        pairs = rest.map(function (x) { return [first, x]; });
    return pairs.concat(pairwise(rest));
}



function generate_images() {

	var high_nameability_colors = ["blue","brown","red","orange","purple","yellow"];
	var low_nameability_colors = ["darkgreenblue","lightred","mustard","neonyellow","pink","turquoise"];

	var all_images =[];
	for (i=0; i<high_nameability_colors.length; i++) {
		all_images.push("stimuli/"+high_nameability_colors[i]+".png");
		all_images.push("stimuli/"+low_nameability_colors[i]+".png");
	}
	all_images.push("stimuli/white_square.png");

  console.log(all_images);

  return(all_images)

}



function generate_block() {

	var timeline=[];
  
  var high_nameability_colors = ["blue","brown","red","orange","purple","yellow"];
  var low_nameability_colors = ["darkgreenblue","lightred","mustard","neonyellow","pink","turquoise"];

  high_nameability_combos=[];
  for (i=0; i<high_nameability_colors.length;i++) {
	  for (j=i+1; j<high_nameability_colors.length;j++) {
		  high_nameability_combos.push([high_nameability_colors[i],high_nameability_colors[j]])
		  high_nameability_combos.push([high_nameability_colors[j],high_nameability_colors[i]])
	  }
  }
  
  low_nameability_combos=[];
  for (i=0; i<low_nameability_colors.length;i++) {
	  for (j=i+1; j<low_nameability_colors.length;j++) {
		  low_nameability_combos.push([low_nameability_colors[i],low_nameability_colors[j]])
		  low_nameability_combos.push([low_nameability_colors[j],low_nameability_colors[i]])
	  }
  }

  //high_nameability_combos = pairwise(high_nameability_colors);
  //low_nameability_combos = pairwise(low_nameability_colors);
  console.log(high_nameability_combos);
  console.log(low_nameability_combos);
  
  all_combos=high_nameability_combos.concat(low_nameability_combos);
  console.log(all_combos)
  
  var order_list=[];
  
  for (i=0; i<all_combos.length/2; i++) {
	  order_list.push("left-right");
	  order_list.push("right-left");
  }
  var order_list_shuffled =jsPsych.randomization.shuffle(order_list);
  var all_combos_shuffled =jsPsych.randomization.shuffle(all_combos);
  console.log(order_list_shuffled);

    for (i=0; i<all_combos.length; i++) {
	  
	  var cur_colors = all_combos_shuffled[i];
	  var cur_target = cur_colors[0];
	  var cur_foil = cur_colors[1];
	  var cur_order=order_list_shuffled[i];
	  if (cur_order == "right-left") {
		  var cur_colors_in_order = [cur_colors[1],cur_colors[0]];
		  var target_location = "right"
	  } else {
		  var cur_colors_in_order = cur_colors;
		  var target_location = "left"
	  }
	  console.log(cur_order);
	  console.log(cur_colors);
	  console.log(cur_target);
	  console.log(cur_foil);
	  
	  var cur_choices = ['<img src="stimuli/'+cur_colors_in_order[0]+'.png">', '<img src="stimuli/'+cur_colors_in_order[1]+'.png">'];
	  var cur_stimulus= '<img src="stimuli/'+cur_target+'.png" style="border: 5px solid #555">';
	  var cur_blank_stimulus= '<img src="stimuli/white_square.png" style="border: 5px solid #555">';
	  
	  console.log(cur_choices);
	  
	  var standard_trial = {
	    type: 'html-button-response',
	    //stimulus: cur_stimulus,
	    stimulus: cur_blank_stimulus,
	    choices: ['<img src="stimuli/white_square.png">', '<img src="stimuli/white_square.png">'],
		  prompt: "",
		  margin_horizontal: "50px",
		  margin_vertical: "30px",
	    post_trial_gap: 0,
		  trial_duration: 1000,
		  response_ends_trials: false,
	      data: {
	        "target": cur_target,
	        "foil": cur_foil,
	        "combination_order": cur_order,
	        "colors_in_order": cur_colors_in_order
	      },
	  }
	  timeline.push(standard_trial);
  
	  var response_trial = {
	    type: 'html-button-response',
	    stimulus: cur_stimulus,
	    choices: cur_choices,
		  prompt: "",
		  margin_horizontal: "50px",
		  margin_vertical: "30px",
	    post_trial_gap: 0,
	      data: {
	        "target": cur_target,
	        "foil": cur_foil,
	        "combination_order": cur_order,
	        "colors_in_order": cur_colors_in_order
	      },
	      on_finish: function(data){
	      	console.log(data.rt);
	      	console.log(data.response);
	      	console.log(data.target);
	      	console.log(data.colors_in_order);
	      // Score the response as correct or incorrect.
	      if (data.colors_in_order[data.response] == data.target) {
	      	data.correct = 1;
	      } else {
	      	data.correct = 0; 
	      }
	  }
	  }
	  timeline.push(response_trial);

	  var audio_feedback = {
	  	type: 'html-audio-button-response',
	  	stimulus: function() {
	  		last_trial_data = jsPsych.data.get().last(1).values()[0];
	  		last_trial_correct = last_trial_data.correct
	  		console.log(last_trial_correct);
	  		if (last_trial_correct == 1) {
	  			return "stimuli/bleep.m4a"
	  		} else {
	  			return "stimuli/buzz.m4a"
	  		}
	  	},
	  	html_stimulus: cur_stimulus,
	    choices: cur_choices,
	    margin_horizontal: "50px",
	    margin_vertical: "30px",
	  	trial_duration: 300,
	  	trial_ends_after_audio: true,
	  	response_allowed_while_playing: false,
	  	data: {
	        "target": cur_target,
	        "foil": cur_foil,
	        "combination_order": cur_order
	      }
	  }

	  timeline.push(audio_feedback);
  }

  return(timeline)
 
	
}