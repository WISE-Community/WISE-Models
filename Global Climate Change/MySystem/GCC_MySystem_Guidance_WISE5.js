var phase = 1;

// references to step numbers containing appropriate visualizations
var generic_guidance = true;
if (generic_guidance){
  var vstep_basic = "the model";
  var vstep_ghg = "the model";
  var vstep_factory = "the model";
  var vstep_ozone = "the model";
  var vstep_cfc = "the model";
} else {
  var vstep_basic = "Step 2.12";
  var vstep_ghg = "Step 3.4";
  var vstep_factory = "Step 3.2";
  var vstep_ozone = "Step 4.2.3";
  var vstep_cfc = "Step 4.3.3";
}


// feedback strings
var f_miss_intro = "Your diagram is not complete.  Improve your diagram by reviewing the visualization in Step ";
var f_nnorm_intro = "We've detected an incorrect connection in your diagram.  Revise your diagram by reviewing the visualization in Step ";
var f_miss_mid = " to find out ";
var f_nnorm_mid = " to find out ";
var f_go_back_to_model = "Read the guidance and go back to the computer model for help.";

var f_SSSI_miss = f_miss_intro  + vstep_basic + " to include all necessary icons.";
var f_SSSIG_miss = f_miss_intro  + vstep_ghg + " to include all necessary icons.";
var f_SSSIGF_miss = f_miss_intro  + vstep_factory + " to include all necessary icons.";
var f_SSSIGFO_miss = f_miss_intro  + vstep_ozone + " to include all necessary icons.";
var f_SSSIGFOC_miss = f_miss_intro  + vstep_cfc + " to include all necessary icons.";

var f_html_intro = "<html>Make sure your diagram answers the questions below. <span style='color:blue'>Go to ";
var f_html_miss_intro = "<html>You're getting there.  Now make sure your diagram answers the questions below. <span style='color:blue'>Go to ";
var f_html_nnorm_intro = "<html>Something is not quite right.  Make sure your diagram answers the questions below. <span style='color:blue'>Go to ";
var f_html_mid = " for help.</span><img src=\'";
var f_html_end = "\'/></html>";

// phase 1
var f_Sun_solar_Surface_miss = f_html_miss_intro + vstep_basic + f_html_mid +"MySystemImages/f_Sun_solar_Surface_miss_ki.png" +f_html_end;
var f_Surface_heat_Beneath_miss = f_html_miss_intro +vstep_basic + f_html_mid + "MySystemImages/f_Surface_heat_Beneath_miss_ki.png" +f_html_end;
var f_Beneath_heat_Surface_miss = f_html_miss_intro + vstep_basic + f_html_mid  + "MySystemImages/f_Beneath_heat_Surface_miss_ki.png" +f_html_end;
var f_Beneath_heat_Surface_Infrared_Space_miss = f_html_miss_intro + vstep_basic + f_html_mid  + "MySystemImages/f_Beneath_heat_Surface_Infrared_Space_miss_ki.png" +f_html_end;
var f_Sun_heat_Surface = f_html_nnorm_intro + vstep_basic +  f_html_mid + "MySystemImages/f_Sun_heat_Surface_ki.png"+f_html_end;

// phase 2
var f_GhG_infrared_Surface_miss = f_html_miss_intro + vstep_ghg + f_html_mid + "MySystemImages/f_GhG_infrared_Surface_miss_ki.png"+f_html_end;
var f_Surface_infrared_Space_wGhG_miss = f_html_miss_intro + vstep_ghg + f_html_mid + "MySystemImages/f_Surface_infrared_Space_wGhG_miss_ki.png"+f_html_end;
// phase 3
var f_BurningFuels_increase_GhG_miss = f_html_miss_intro + vstep_factory  + f_html_mid + "MySystemImages/f_BurningFuels_increase_GhG_miss_ki.png"+f_html_end;
var f_GhG_decrease_PolarIce_miss = f_html_miss_intro + vstep_factory  + f_html_mid + "MySystemImages/f_GhG_decrease_PolarIce_miss_ki.png"+f_html_end;
var f_BurningFuels_decrease_GhG = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_BurningFuels_decrease_GhG_ki.png"+f_html_end;
var f_BurningFuels_decrease_PolarIce = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_BurningFuels_decrease_PolarIce_ki.png"+f_html_end;
var f_BurningFuels_increase_SkinCancer = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_BurningFuels_increase_SkinCancer_ki.png"+f_html_end;
var f_GhG_increase_PolarIce = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_GhG_increase_PolarIce_ki.png"+f_html_end;
var f_GhG_increase_SkinCancer = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_GhG_increase_SkinCancer_ki.png"+f_html_end;
// phase 4
var f_Sun_uv_OzoneLayer_uv_Space_miss = f_html_miss_intro +vstep_ozone + f_html_mid  + "MySystemImages/f_Sun_uv_OzoneLayer_uv_Space_miss_ki.png" +f_html_end;
var f_OzoneLayer_nonuv_Space = f_html_nnorm_intro +vstep_ozone + f_html_mid  + "MySystemImages/f_OzoneLayer_nonuv_Space_ki.png" +f_html_end;
// phase 5
var f_AerosolCans_increase_CFCs_miss = f_html_miss_intro +vstep_cfc + f_html_mid + "MySystemImages/f_AerosolCans_increase_CFCs_miss_ki.png" +f_html_end;
var f_CFCs_decrease_OzoneLayer_miss = f_html_miss_intro +vstep_cfc + f_html_mid + "MySystemImages/f_CFCs_decrease_OzoneLayer_miss_ki.png" +f_html_end;
var f_OzoneLayer_decrease_SkinCancer_miss = f_html_miss_intro +vstep_cfc + f_html_mid + "MySystemImages/f_OzoneLayer_decrease_SkinCancer_miss_ki.png" +f_html_end;
var f_BurningFuels_decrease_OzoneLayer = f_html_nnorm_intro +vstep_cfc + f_html_mid + "MySystemImages/f_BurningFuels_decrease_OzoneLayer_ki.png" +f_html_end;
var f_BurningFuels_increase_OzoneLayer = f_html_nnorm_intro +vstep_cfc + f_html_mid + "MySystemImages/f_BurningFuels_increase_OzoneLayer_ki.png" +f_html_end;
var f_CFCs_increase_OzoneLayer = f_html_nnorm_intro +vstep_cfc + f_html_mid + "MySystemImages/f_CFCs_increase_OzoneLayer_ki.png" +f_html_end;
var f_AerosolCans_decrease_OzoneLayer = f_html_nnorm_intro +vstep_cfc + f_html_mid + "MySystemImages/f_AerosolCans_decrease_OzoneLayer_ki.png" +f_html_end;
var f_AerosolCans_increase_GhG = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_AerosolCans_increase_GhG_ki.png"+f_html_end;
var f_OzoneLayer_increase_SkinCancer = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_OzoneLayer_increase_SkinCancer_ki.png"+f_html_end;
var f_OzoneLayer_increase_PolarIce = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_OzoneLayer_increase_PolarIce_ki.png"+f_html_end;
var f_OzoneLayer_decrease_PolarIce = f_html_nnorm_intro + vstep_factory  + f_html_mid  +"MySystemImages/f_OzoneLayer_decrease_PolarIce_ki.png"+f_html_end; 

var my_feedback = "";
var my_score = 1;
// main links:
var has_solar_to_earth = false;
var has_solar_to_heat = false;
var has_heat_to_infrared = false;
var has_infrared_reflected = false;
// phase 1: Sun, Space, Surface, Beneath - energy system (SR, IR, heat)
if (phase == 1 || phase == 2 || phase == 4){    
  // non-normative energy from Sun or Space to Earth
    if (any("Sun (Heat) Surface","Sun (Heat) Interior",all("Sun (Heat) Space",any("Space (Heat) Surface","Space (Heat) Interior")))) {
        if (my_feedback === "") my_feedback = f_Sun_heat_Surface;
        my_score = 2;
    }
   
    // solar radiation from Sun (Sun to Surface or Sun to Space to Surface
    if (!any("Sun (SR) Surface", all("Sun (SR) Space", "Space (SR) Surface"))){
        if (my_feedback === "") my_feedback = f_Sun_solar_Surface_miss;
    } else {
        has_solar_to_earth = true;
    }
    // heat from Surface to Interior
    if (!any("Surface (Heat) Interior")){
       if (my_feedback === "") my_feedback = f_Surface_heat_Beneath_miss;    
  } else {
       has_solar_to_heat = true;
       if (my_score != 2) my_score = 3;
  }

  // heat from Interior to surface
  if (!any("Interior (Heat) Surface")){
     if (my_feedback === "") my_feedback = f_Beneath_heat_Surface_miss;
  }

  if (phase == 1){
        // heat from Interior to Surface and then released to Space as infrared
        if (!all("Interior (Heat) Surface","Surface (IR) Space")){
            if (my_feedback === "") my_feedback = f_Beneath_heat_Surface_Infrared_Space_miss;
        } else {
            has_heat_to_infrared = true;
            if (has_solar_to_earth && my_score != 2 ){ 
              my_score = 4;
            }
            else if (my_score != 2) {my_score = 3;}
        }
  }
} 
// phase 2: Sun, Space, Surface, Beneath, GhG - energy system (SR, IR, heat)
if (phase == 2 || phase == 4){
    
    // some energy to ghg and back to Surface
    if (!all("Surface (IR) GHGases", "GHGases (IR) Surface")){
        if (my_feedback === "") my_feedback = f_GhG_infrared_Surface_miss;
    } else {
        if (my_score > 2) {
            my_score ++;
        } else {
            my_score = 3;
        }
    }
    // but some energy needs to escape
    if (!any("Surface (IR) Space", all("Surface (IR) GHGases", "GHGases (IR) Space"))){
        if (my_feedback === "") my_feedback = f_Surface_infrared_Space_wGhG_miss;
    }

    // heat needs to be released somewhere
    if (!all("Interior (Heat) Surface",any("Surface (IR) Space", "Surface (IR) GHGases"))){
        if (my_feedback === "") my_feedback = f_Beneath_heat_Surface_Infrared_Space_miss;
    }
}
// phase 4: Sun, Space, Surface, Beneath, GhG, factories, ozone layer - energy system (SR, IR, heat, UV)
if (phase == 4){
    if (any("Ozone Layer (IR) Space","Ozone Layer (Heat) Space", "Ozone Layer (SR) Space")){
        if (my_feedback === "") my_feedback = f_OzoneLayer_nonuv_Space;
        my_score = 2;
    }
    if (!any(all("Sun (UV) Ozone Layer", "Ozone Layer (UV) Space"), all("Sun (UV) Space", "Space (UV) Ozone Layer", "Ozone Layer (UV) Space"))){
        if (my_feedback === "") my_feedback = f_Sun_uv_OzoneLayer_uv_Space_miss;
    } else {
        if (my_score != 2) my_score = 3;
    }
}
// phase 3: Burning Fuels, Aerosol Cans, GHGases, Polar Ice, Skin Cancer
if (phase == 3 || phase == 5){
       
    // non-normatives
    if (any("Burning Fuels (Decrease) GHGases")){
      if (my_feedback === "") my_feedback = f_BurningFuels_decrease_GhG;
      my_score = 2;
  }
  if (any("Burning Fuels (Decrease) Polar Ice")){
      if (my_feedback === "") my_feedback = f_BurningFuels_decrease_PolarIce;
      my_score = 3;
  }
  if (any("Burning Fuels (Increase) Skin Cancer")){
      if (my_feedback === "") my_feedback = f_BurningFuels_increase_SkinCancer;
      my_score = 2;
  }
  if (any("GHGases (Increase) Polar Ice")){
      if (my_feedback === "") my_feedback = f_GhG_increase_PolarIce;
      my_score = 2;
  }
  if (any("GHGases (Increase) Skin Cancer")){
      if (my_feedback === "") my_feedback = f_GhG_increase_SkinCancer;
      my_score = 2;
  }
  // combinations of normatives
  if (any("GHGases (Decrease) Polar Ice") && any("Burning Fuels (Increase) GHGases")){
    if (phase == 3) my_feedback = "Great Job, keep going!";
    my_score = 4;
  } else if (any("GHGases (Decrease) Polar Ice") && !any("Burning Fuels (Increase) GHGases")){
    if (my_feedback === "") my_feedback = f_BurningFuels_increase_GhG_miss;
    my_score = 3;
  } else if (!any("GHGases (Decrease) Polar Ice") && any("Burning Fuels (Increase) GHGases")){
    if (my_feedback === "") my_feedback = f_GhG_decrease_PolarIce_miss;
    my_score = 3;
  } else {
    if (my_feedback === "") my_feedback = f_BurningFuels_increase_GhG_miss;
    my_score = 2;
  }
}
// phase 5: Sun, Space, Surface, Beneath, GhG, factories, ozone layer, CFCs - material system (increase, decrease)
if (phase == 5){
  // non-normatives about production of ozone
    if (any("Burning Fuels (Increase) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_BurningFuels_increase_OzoneLayer;
        my_score = 2;
    }
    if (any("Burning Fuels (Decrease) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_BurningFuels_decrease_OzoneLayer;
        my_score = 2;
    }
    if (any("CFCs (Increase) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_CFCs_increase_OzoneLayer;
        my_score = 2;
    }    
    if (any("Aerosol Cans (Increase) GHGases")){
        if (my_feedback === "") my_feedback = f_AerosolCans_increase_GhG;
        my_score = 2;
    } 
    if (any("Ozone Layer (Increase) Skin Cancer") && !any("CFCs (Decrease) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_OzoneLayer_increase_SkinCancer;
        my_score = 2;
    } 
    if (any("Ozone Layer (Increase) Polar Ice")){
        if (my_feedback === "") my_feedback = f_OzoneLayer_increase_PolarIce;
        my_score = 2;
    } 
    if (any("Ozone Layer (Decrease) Polar Ice")){
        if (my_feedback === "") my_feedback = f_OzoneLayer_decrease_PolarIce;
        my_score = 2;
    } 
    // almost there
    if (any("Aerosol Cans (Decrease) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_BurningFuels_decrease_OzoneLayer;
        my_score++;
    } 
    
    if (any("Aerosol Cans (Increase) CFCs") && any("CFCs (Decrease) Ozone Layer") && any("Ozone Layer (Decrease) Skin Cancer", "Ozone Layer (Increase) Skin Cancer")){
      if (my_feedback === "") my_feedback = "Great Job, keep going!";
      my_score += 2;
    } else if (any("Aerosol Cans (Increase) CFCs") && any("CFCs (Decrease) Ozone Layer") && !any("Ozone Layer (Decrease) Skin Cancer")){
      if (my_feedback === "") my_feedback = f_OzoneLayer_decrease_SkinCancer_miss;
      my_score += 1;
    } else if (!any("Aerosol Cans (Increase) CFCs") && any("CFCs (Decrease) Ozone Layer") && any("Ozone Layer (Decrease) Skin Cancer")){
      if (my_feedback === "") my_feedback = f_AerosolCans_increase_CFCs_miss;
      my_score += 1;
    } else if (any("Aerosol Cans (Increase) CFCs","CFCs (Decrease) Ozone Layer","Ozone Layer (Decrease) Skin Cancer")){
      if (!any("Aerosol Cans (Increase) CFCs")){
        if (my_feedback === "") my_feedback = f_AerosolCans_increase_CFCs_miss;
      } else if (!any("CFCs (Decrease) Ozone Layer")){
        if (my_feedback === "") my_feedback = f_CFCs_decrease_OzoneLayer_miss;
      } else if (!any("Ozone Layer (Decrease) Skin Cancer")){
        if (my_feedback === "") my_feedback = f_OzoneLayer_decrease_SkinCancer_miss;
      }
      if (my_score == 2){
        my_score++;
      }
    } else {
      if (my_feedback === "") my_feedback = f_AerosolCans_increase_CFCs_miss;
    }
}

if (my_feedback === ""){
  // all icons
  if (phase == 1){
      if (!all("Contains At Least One Sun", "Contains At Least One Space", "Contains At Least One Surface", "Contains At Least One Interior")){
          my_feedback = f_SSSI_miss;
      }
  } else if (phase == 2){
      if (!all("Contains At Least One Sun", "Contains At Least One Space", "Contains At Least One Surface", "Contains At Least One Interior")) {
        my_feedback = f_SSSIG_miss;
      }
  } else if (phase == 3){
      if (!all("Contains At Least One Sun", "Contains At Least One Space", "Contains At Least One Surface", "Contains At Least One Interior")){
          my_feedback = f_SSSIGF_miss;
      }
  } else if (phase == 4){
      if (!all("Contains At Least One Sun", "Contains At Least One Space", "Contains At Least One Surface", "Contains At Least One Interior")){
          my_feedback = f_SSSIGFO_miss;
      }
  } else if (phase == 5){
      if (!all("Contains At Least One Sun", "Contains At Least One Space", "Contains At Least One Surface", "Contains At Least One Interior")){
          my_feedback = f_SSSIGFOC_miss;
      }
  }
}

if (my_feedback === "") {
  my_feedback = "Great Job! Continue to the next step."
}

var result = {};
result.score = my_score;
result.feedback = my_feedback;
setResult(result);